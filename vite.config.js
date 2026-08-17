import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { liveProjects } from './src/data/projects.js'

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
function seo(siteUrl) {
  const routes = [
    { path: '/', priority: '1.0' },
    { path: '/work', priority: '0.9' },
    ...liveProjects.map((p) => ({ path: `/work/${p.slug}`, priority: '0.7' })),
    { path: '/contact', priority: '0.8' },
  ]

  return {
    name: 's7-seo',

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
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '')

  return {
    plugins: [react(), tailwindcss(), seo(siteUrl)],
    resolve: {
      alias: { '@': path.resolve(process.cwd(), 'src') },
    },
    build: {
      target: 'es2022',
      rollupOptions: {
        output: {
          // Split the animation runtime out of the app shell so the first paint
          // isn't waiting on it. (Rolldown wants the function form.)
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
