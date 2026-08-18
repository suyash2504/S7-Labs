import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { routes } from './src/data/routes.js'

/**
 * Absolute-URL SEO artefacts, driven by one env var.
 *
 * canonical, og:url, og:image and sitemap.xml all require an absolute origin.
 * Hardcoding a guess means telling Google the site lives at a domain nobody
 * owns, so `%SITE_URL%` is filled in when VITE_SITE_URL is set and the whole
 * line is dropped when it isn't. robots.txt and sitemap.xml are emitted the
 * same way — no sitemap at all rather than one full of wrong URLs.
 *
 *   .env
 *   VITE_SITE_URL=https://s7labs.in
 */
const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

/** Rewrite one attribute on the first tag matching `tagRe`, if that tag exists. */
const setAttr = (html, tagRe, attr, value) =>
  html.replace(tagRe, (tag) => {
    const re = new RegExp(`${attr}="[^"]*"`)
    return re.test(tag) ? tag.replace(re, `${attr}="${escapeAttr(value)}"`) : tag
  })

/**
 * Take the built index.html and restamp its <head> for one route.
 *
 * The body stays as-is — React fills that in, and Googlebot runs JS. What it
 * will not reliably do is re-read a canonical it already saw in the raw HTML,
 * which is exactly why this exists.
 */
function headFor(baseHtml, route, siteUrl) {
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(route.title)}</title>`)

  const meta = (key, attr = 'property') => new RegExp(`<meta\\b[^>]*\\b${attr}="${key}"[^>]*>`)

  html = setAttr(html, meta('description', 'name'), 'content', route.description)
  html = setAttr(html, meta('og:title'), 'content', route.title)
  html = setAttr(html, meta('og:description'), 'content', route.description)
  html = setAttr(html, meta('twitter:title', 'name'), 'content', route.title)
  html = setAttr(html, meta('twitter:description', 'name'), 'content', route.description)

  if (siteUrl) {
    const url = `${siteUrl}${route.path}`
    html = setAttr(html, meta('og:url'), 'content', url)
    html = setAttr(html, /<link\b[^>]*\brel="canonical"[^>]*>/, 'href', url)
  }

  return html
}

function seo(siteUrl) {
  let root = process.cwd()
  let outDir = 'dist'

  return {
    name: 's7-seo',

    configResolved(config) {
      root = config.root
      outDir = config.build.outDir
    },

    transformIndexHtml(html) {
      if (siteUrl) return html.replaceAll('%SITE_URL%', siteUrl)
      // Drop every line that depends on an origin we don't have.
      return html
        .split('\n')
        .filter((line) => !line.includes('%SITE_URL%'))
        .join('\n')
    },

    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: siteUrl
          ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
          : `User-agent: *\nAllow: /\n`,
      })

      if (!siteUrl) return

      const urls = routes
        .map(
          (r) =>
            `  <url>\n    <loc>${siteUrl}${r.path}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
        )
        .join('\n')

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },

    /**
     * Write a real HTML file for every route, so a crawler's first request for
     * /work gets /work's title and canonical rather than the homepage's.
     *
     * Runs in closeBundle, once index.html is definitely on disk with the
     * hashed asset tags and %SITE_URL% already resolved. Netlify serves a file
     * that exists in preference to the SPA redirect, so these take over from
     * the /* -> /index.html fallback without any config change.
     */
    closeBundle() {
      const dir = path.resolve(root, outDir)
      const indexPath = path.join(dir, 'index.html')
      if (!fs.existsSync(indexPath)) return

      const base = fs.readFileSync(indexPath, 'utf8')

      for (const route of routes) {
        if (route.path === '/') continue
        const target = path.join(dir, route.path.slice(1))
        fs.mkdirSync(target, { recursive: true })
        fs.writeFileSync(path.join(target, 'index.html'), headFor(base, route, siteUrl))
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '')

  // Single-file build: one self-contained .html that runs off file://.
  // Everything must land in one chunk, so code splitting and CSS splitting are
  // both off and scripts/styles get inlined afterwards by scripts/bundle-single.mjs.
  const single = Boolean(env.VITE_SINGLE_FILE)

  return {
    plugins: [react(), tailwindcss(), ...(single ? [] : [seo(siteUrl)])],
    resolve: {
      alias: { '@': path.resolve(process.cwd(), 'src') },
    },
    build: {
      target: 'es2022',
      ...(single
        ? { outDir: 'dist-single', cssCodeSplit: false, assetsInlineLimit: 100_000_000 }
        : {}),
      rollupOptions: {
        // Rolldown rejects inlineDynamicImports alongside manualChunks, so the
        // single-file build omits the chunking config entirely rather than
        // returning undefined from it.
        output: single
          ? { inlineDynamicImports: true }
          : {
              // Split the animation runtime out of the app shell so the first
              // paint isn't waiting on it. (Rolldown wants the function form.)
              manualChunks(id) {
                if (!id.includes('node_modules')) return
                if (
                  id.includes('framer-motion') ||
                  id.includes('motion-dom') ||
                  id.includes('motion-utils')
                )
                  return 'motion'
                if (id.includes('react-router')) return 'router'
                if (id.includes('lucide-react')) return 'icons'
              },
            },
      },
    },
  }
})
