/**
 * ---------------------------------------------------------------------------
 * PROJECT SCREENSHOT CAPTURE
 * ---------------------------------------------------------------------------
 * Grabs real screenshots of a live project and writes them into
 * `public/work/<slug>/`, ready to reference as `cover:` in data/projects.js.
 *
 *   node scripts/capture-project.mjs <url> <slug> [scrollFractions...]
 *
 * Examples:
 *   node scripts/capture-project.mjs http://localhost:4180 apex-gym
 *   node scripts/capture-project.mjs https://client.com joystick-junction 0 .35 .7
 *
 * Notes:
 *   · Runs headless Chromium with SwiftShader so WebGL/Three.js scenes render.
 *   · Waits for fonts and for the scene to settle before each frame.
 *   · Emits cover.jpg (first frame) plus shot-02.jpg, shot-03.jpg, …
 * ---------------------------------------------------------------------------
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const [, , url, slug, ...fracArgs] = process.argv

if (!url || !slug) {
  console.error('usage: node scripts/capture-project.mjs <url> <slug> [fractions...]')
  process.exit(1)
}

const fractions = fracArgs.length ? fracArgs.map(Number) : [0]
const outDir = path.resolve('public/work', slug)
fs.mkdirSync(outDir, { recursive: true })

const VIEWPORT = { width: 1920, height: 1200 }

const browser = await chromium.launch({
  args: [
    // Headless Chromium needs to be told to software-render WebGL, otherwise
    // Three.js scenes come back as an empty canvas.
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
  ],
})

const page = await browser.newPage({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  colorScheme: 'dark',
  reducedMotion: 'no-preference',
})

console.log(`→ ${url}`)
await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
await page.evaluate(() => document.fonts.ready)
// Let entrance animations and the first WebGL frames settle.
await page.waitForTimeout(6000)

for (const [i, frac] of fractions.entries()) {
  if (frac > 0) {
    await page.evaluate((f) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: max * f, behavior: 'instant' })
    }, frac)
    // Scroll-driven cameras and reveal animations need a beat to catch up.
    await page.waitForTimeout(3500)
  }

  const name = i === 0 ? 'cover.jpg' : `shot-${String(i + 1).padStart(2, '0')}.jpg`
  const file = path.join(outDir, name)
  await page.screenshot({ path: file, type: 'jpeg', quality: 92 })
  const { size } = fs.statSync(file)
  console.log(`  ${name}  ${VIEWPORT.width}×${VIEWPORT.height}  ${Math.round(size / 1024)}KB`)
}

await browser.close()
console.log(`✓ wrote ${fractions.length} file(s) to public/work/${slug}/`)
