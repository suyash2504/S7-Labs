/**
 * Renders scripts/og-template.html to public/og-image.png at 1200×630.
 *
 *   node scripts/build-og.mjs
 *
 * Re-run after editing the template. PNG rather than SVG because several
 * crawlers (and most chat clients) refuse to render SVG link previews.
 */
import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

const template = path.resolve('scripts/og-template.html')
const out = path.resolve('public/og-image.png')

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
})

await page.goto(pathToFileURL(template).href, { waitUntil: 'networkidle' })
// Without this the headline renders in the fallback face.
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)

await page.screenshot({ path: out, type: 'png' })
await browser.close()

const { size } = fs.statSync(out)
console.log(`✓ public/og-image.png  1200×630  ${Math.round(size / 1024)}KB`)
