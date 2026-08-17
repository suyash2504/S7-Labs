import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Route-aware scrolling:
 *   · `/#services` (from any route) scrolls to that section
 *   · a plain route change jumps to the top
 * Waits a frame so the incoming page has laid out before measuring.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (hash) {
      const id = hash.slice(1)
      let tries = 0
      const find = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
          return
        }
        // The target section may still be mounting after a route change.
        if (tries++ < 12) requestAnimationFrame(find)
      }
      requestAnimationFrame(find)
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash, key])

  return null
}
