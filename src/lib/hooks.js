import { useCallback, useEffect, useRef, useState } from 'react'

/** SSR-safe media query hook. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * True when the device has a real pointer (mouse/trackpad).
 * Every cursor / magnetic / hover-parallax effect gates on this so touch
 * devices never pay for desktop-only interaction.
 */
export function useHasPointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/** Lock page scroll (mobile menu) without the layout jumping. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const { body } = document
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
    }
  }, [locked])
}

/**
 * Normalised pointer position inside an element: {-1..1, -1..1}.
 * Returns a ref to attach and a `pos` object. Updates are throttled to
 * animation frames.
 */
export function useElementPointer(enabled = true) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0, active: false })
  const frame = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const onMove = (e) => {
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        const r = el.getBoundingClientRect()
        setPos({
          x: ((e.clientX - r.left) / r.width) * 2 - 1,
          y: ((e.clientY - r.top) / r.height) * 2 - 1,
          active: true,
        })
      })
    }
    const onLeave = () => setPos({ x: 0, y: 0, active: false })

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame.current)
    }
  }, [enabled])

  return [ref, pos]
}

/** Fires once the window has scrolled past `threshold` px. */
export function useScrolledPast(threshold = 24) {
  const [past, setPast] = useState(false)

  useEffect(() => {
    let ticking = false
    const check = () => {
      ticking = false
      setPast(window.scrollY > threshold)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return past
}

/**
 * Tracks which section id is currently in view — drives the active state in
 * the navbar. Ids that don't exist on the current route are ignored.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  const key = ids.join('|')

  useEffect(() => {
    const targets = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!targets.length) {
      setActive(null)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.6, 1] },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [key])

  return active
}

/**
 * Copy-to-clipboard with a short status flash.
 *
 * Returns 'idle' | 'copied' | 'failed'. The Clipboard API refuses outside a
 * secure or focused context (it throws NotAllowedError), so this falls back to
 * the legacy execCommand path before giving up — and when it does give up it
 * says so, rather than leaving a button that silently does nothing.
 */
export function useCopy(timeout = 1600) {
  const [status, setStatus] = useState('idle')

  const copy = useCallback(
    async (text) => {
      const flash = (s) => {
        setStatus(s)
        setTimeout(() => setStatus('idle'), timeout)
      }

      try {
        await navigator.clipboard.writeText(text)
        return flash('copied')
      } catch {
        /* fall through to the legacy path */
      }

      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.setAttribute('readonly', '')
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        flash(ok ? 'copied' : 'failed')
      } catch {
        flash('failed')
      }
    },
    [timeout],
  )

  return [status, copy]
}
