import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useHasPointer, usePrefersReducedMotion } from '@/lib/hooks'

/**
 * Two-part cursor: a hard dot that tracks exactly, and a ring that trails on a
 * spring. Interactive targets are detected by delegation — no component needs
 * to opt in. Add `data-cursor="view"` to anything that should show the VIEW
 * badge (portfolio media does this).
 *
 * Disabled entirely on touch devices and under prefers-reduced-motion, where
 * the native cursor is left alone.
 */
export function CustomCursor() {
  const hasPointer = useHasPointer()
  const reduced = usePrefersReducedMotion()
  const enabled = hasPointer && !reduced

  const [mode, setMode] = useState('default') // default | link | view
  const [visible, setVisible] = useState(false)
  const [down, setDown] = useState(false)
  const raf = useRef(0)
  const seen = useRef(false)

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { stiffness: 420, damping: 34, mass: 0.5 })
  const ringY = useSpring(dotY, { stiffness: 420, damping: 34, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return

    // Hide the OS cursor only once we know we're driving our own. The class
    // wins over per-element `cursor: pointer` (see index.css).
    document.documentElement.classList.add('s7-no-cursor')

    const onMove = (e) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      if (!seen.current) {
        seen.current = true
        setVisible(true)
      }

      if (raf.current) return
      raf.current = requestAnimationFrame(() => {
        raf.current = 0
        const el = e.target instanceof Element ? e.target : null
        const target = el?.closest('[data-cursor], a, button, input, textarea, select, [role="button"]')
        if (!target) return setMode('default')
        setMode(target.getAttribute('data-cursor') === 'view' ? 'view' : 'link')
      })
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('blur', onLeave)

    return () => {
      document.documentElement.classList.remove('s7-no-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('blur', onLeave)
      cancelAnimationFrame(raf.current)
    }
  }, [enabled, dotX, dotY])

  if (!enabled) return null

  const ring = {
    default: { width: 34, height: 34, borderColor: 'rgba(163,163,163,0.45)', backgroundColor: 'rgba(229,9,20,0)' },
    link: { width: 58, height: 58, borderColor: 'rgba(229,9,20,0.85)', backgroundColor: 'rgba(229,9,20,0.06)' },
    view: { width: 92, height: 92, borderColor: 'rgba(229,9,20,0)', backgroundColor: 'rgba(229,9,20,0.95)' },
  }[mode]

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] hidden lg:block">
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border will-change-transform"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          ...ring,
          opacity: visible ? 1 : 0,
          scale: down ? 0.86 : 1,
        }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          className="font-sans text-[0.5625rem] font-semibold tracking-[0.18em] text-white uppercase"
          animate={{ opacity: mode === 'view' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          View
        </motion.span>
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 size-1.5 rounded-full bg-chalk will-change-transform"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible && mode !== 'view' ? 1 : 0, scale: mode === 'link' ? 0.5 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  )
}
