/**
 * ---------------------------------------------------------------------------
 * SINGLE-FILE BUILD
 * ---------------------------------------------------------------------------
 * Folds dist-single/ into one self-contained .html that runs by double-clicking
 * it — no server, no hosting. Useful for showing the site to someone before
 * it's deployed.
 *
 *   npm run build:single   →   s7-labs-standalone.html
 *
 * What gets inlined:
 *   · the JS bundle and the stylesheet (as inline <script> / <style>)
 *   · the favicon
 *   · every project image referenced by a runtime path string in the bundle
 *     (data/projects.js stores plain paths, so Vite can't see them as imports)
 *
 * Trade-offs, all inherent to running off file://:
 *   · routes use #/work/apex-gym rather than /work/apex-gym (see main.jsx)
 *   · the file is a few MB, since images become base64
 *   · Google Fonts still need a connection; offline it falls back to system
 *     faces and the layout shifts a little
 * ---------------------------------------------------------------------------
 */
import fs from 'node:fs'
import path from 'node:path'

const DIST = 'dist-single'
const OUT = 's7-labs-standalone.html'

const mime = (f) =>
  ({
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  })[path.extname(f).toLowerCase()] || 'application/octet-stream'

const dataUri = (file) =>
  `data:${mime(file)};base64,${fs.readFileSync(file).toString('base64')}`

/** Every file under public/ that a runtime path string might point at. */
function collectAssets(dir, base = '') {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name)
    const url = `${base}/${e.name}`
    return e.isDirectory() ? collectAssets(full, url) : [{ url, full }]
  })
}

let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')

// --- inline the stylesheet -------------------------------------------------
const cssHref = html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css)"[^>]*>/)
if (cssHref) {
  const css = fs.readFileSync(path.join(DIST, cssHref[1].replace(/^\//, '')), 'utf8')
  // Function replacer, not a string: `$&`, `` $` `` and `$'` are special inside
  // a string replacement, and `` $` `` in particular re-inserts everything
  // before the match. Minified bundles contain those sequences, which
  // duplicated the whole <head> dozens of times and ballooned the output.
  html = html.replace(cssHref[0], () => `<style>${css}</style>`)
}

// --- inline the JS bundle --------------------------------------------------
const scriptTag = html.match(/<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/)
if (!scriptTag) {
  console.error('No bundle found — did the single-file build emit one chunk?')
  process.exit(1)
}
let js = fs.readFileSync(path.join(DIST, scriptTag[1].replace(/^\//, '')), 'utf8')

// --- swap runtime asset paths for data URIs --------------------------------
// projects.js stores `cover: '/work/apex-gym/cover.jpg'` as a literal string,
// so the bundler never sees it as a dependency and cannot inline it itself.
const INLINEABLE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg'])

let swapped = 0
for (const asset of collectAssets('public')) {
  if (!INLINEABLE.has(path.extname(asset.url).toLowerCase())) continue
  if (!js.includes(asset.url) && !html.includes(asset.url)) continue
  const uri = dataUri(asset.full)
  js = js.replaceAll(asset.url, uri)
  html = html.replaceAll(asset.url, uri)
  swapped++
}

// `</script>` anywhere in the bundle would close the tag early. Function
// replacer again — see the CSS note above.
html = html.replace(
  scriptTag[0],
  () => `<script type="module">${js.replaceAll('</script>', '<\\/script>')}</script>`,
)

// Nothing can resolve %SITE_URL% in a file:// build, so drop those tags.
html = html
  .split('\n')
  .filter((line) => !line.includes('%SITE_URL%'))
  .join('\n')

fs.writeFileSync(OUT, html)

const kb = Math.round(fs.statSync(OUT).size / 1024)
console.log(`✓ ${OUT}  ${kb} KB  (${swapped} asset${swapped === 1 ? '' : 's'} inlined)`)
