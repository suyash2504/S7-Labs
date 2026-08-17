/**
 * Lighthouse audit against the production build.
 *
 *   npm run build && npm run preview   # in one terminal
 *   node scripts/audit.mjs [url]
 *
 * Launches Chromium through Playwright with a remote-debugging port and hands
 * that port to Lighthouse — chrome-launcher can't spawn the Playwright binary
 * directly in some environments.
 */
import { chromium } from 'playwright'
import lighthouse from 'lighthouse'
import fs from 'node:fs'

const url = process.argv[2] || 'http://localhost:4173/'
const PORT = 9222

const browser = await chromium.launch({
  args: [`--remote-debugging-port=${PORT}`, '--no-sandbox'],
})

try {
  const result = await lighthouse(
    url,
    {
      port: PORT,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    },
    undefined,
  )

  const { lhr } = result
  fs.writeFileSync('lh.json', JSON.stringify(lhr, null, 2))

  const scores = Object.values(lhr.categories).map(
    (c) => `${c.title.padEnd(16)} ${Math.round(c.score * 100)}`,
  )
  const metricKeys = [
    'first-contentful-paint',
    'largest-contentful-paint',
    'total-blocking-time',
    'cumulative-layout-shift',
    'speed-index',
  ]
  const metrics = metricKeys.map(
    (k) => `${lhr.audits[k].title.padEnd(26)} ${String(lhr.audits[k].displayValue).padEnd(9)}`,
  )

  // Anything scored below 0.9 that isn't purely informational.
  const failing = Object.values(lhr.audits)
    .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative')
    .sort((a, b) => a.score - b.score)
    .map((a) => `[${a.score.toFixed(2)}] ${a.title}`)

  console.log('\n=== SCORES ===\n' + scores.join('\n'))
  console.log('\n=== METRICS ===\n' + metrics.join('\n'))
  console.log('\n=== FAILING AUDITS ===\n' + (failing.join('\n') || 'none'))
} finally {
  await browser.close()
}
