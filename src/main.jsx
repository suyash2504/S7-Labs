import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// The hero has a timed load sequence; restoring a mid-page scroll on reload
// drops the visitor into the middle of it. Start at the top instead.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

/**
 * Deploy-safety net. A visitor with the page already open when a new build
 * ships still holds the old index.html, so navigating to a lazy route requests
 * a chunk that no longer exists. Because the host rewrites unknown paths to
 * index.html, that request returns HTML with a 200 rather than a 404, and the
 * dynamic import dies with a confusing parse error instead of a clean failure.
 *
 * Vite fires `vite:preloadError` in exactly this case — reload once to pick up
 * the new index.html.
 *
 * The guard is a timestamp, not a boolean: a boolean cleared on `load` would be
 * wiped by the very reload it guards, turning a genuinely broken deploy into an
 * infinite loop. Recording *when* we last reloaded means a hard failure gives
 * up after one attempt, while a page left open for hours can still self-heal on
 * a later deploy.
 */
window.addEventListener('vite:preloadError', (event) => {
  const KEY = 's7:chunk-reload-at'
  const last = Number(sessionStorage.getItem(KEY) || 0)
  if (Date.now() - last < 15_000) return // just tried — let the error surface
  event.preventDefault()
  sessionStorage.setItem(KEY, String(Date.now()))
  window.location.reload()
})

/**
 * The single-file build (`npm run build:single`) is opened straight off disk
 * over file://, where the History API can't push real paths — so that build
 * routes on the hash instead. Every hosted build keeps clean URLs.
 */
const Router = import.meta.env.VITE_SINGLE_FILE ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
