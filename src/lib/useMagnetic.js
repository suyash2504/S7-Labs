import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { pointerSpring } from './motion'
import { useHasPointer, usePrefersReducedMotion } from './hooks'

/**
 * Magnetic pull: the element drifts toward the pointer while it is nearby,
 * then springs home. Desktop-only and disabled under reduced-motion.
 *
 *   const { ref, x, y } = useMagnetic(0.3)
 *   <motion.button ref={ref} style={{ x, y }} />
 */
export function useMagnetic(strength = 0.28, radius = 1.4, max = 10) {
  const ref = useRef(null)
  const hasPointer = useHasPointer()
  const reduced = usePrefersReducedMotion()
  const enabled = hasPointer && !reduced

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, pointerSpring)
  const y = useSpring(my, pointerSpring)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    let frame = 0
    const onMove = (e) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        // Only react inside an expanded hit area around the element.
        if (
          Math.abs(dx) > (r.width / 2) * radius + 40 ||
          Math.abs(dy) > (r.height / 2) * radius + 40
        ) {
          mx.set(0)
          my.set(0)
          return
        }
        // Hard-clamp the travel. Unbounded, a wide button reaches ~40px and
        // collides with whatever sits next to it in the CTA row.
        mx.set(clamp(dx * strength, max))
        my.set(clamp(dy * strength, max))
      })
    }
    const reset = () => {
      mx.set(0)
      my.set(0)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('blur', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', reset)
      cancelAnimationFrame(frame)
      reset()
    }
  }, [enabled, strength, radius, max, mx, my])

  return { ref, x: enabled ? x : 0, y: enabled ? y : 0, enabled }
}

const clamp = (v, limit) => (v > limit ? limit : v < -limit ? -limit : v)
