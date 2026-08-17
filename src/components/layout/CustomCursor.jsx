import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { EASE } from '@/lib/motion'
import { useHasPointer, usePrefersReducedMotion } from '@/lib/hooks'

/**
 * Difference-blend cursor: a white disc set to `mix-blend-mode: difference`,
 * so it inverts whatever sits under it — near-white over the page, dark as it
 * crosses the headline. One element, no dot, no border.
 *
 * The blend is switched OFF over portfolio media (`data-cursor="view"`).
 * Differencing against a photograph produces muddy inverted colour — the neon
 * magenta in the Joystick Junction cover comes back cyan — so over media the
 * disc becomes a solid red badge instead, which stays readable on anything.
 *
 * Interactive targets are found by delegation, so no component opts in.
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

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // Stiff spring: enough lag to feel alive, not so much that clicking feels
  // imprecise — this disc is the only pointer on screen.
  const sx = useSpring(x, { stiffness: 700, damping: 42, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 700, damping: 42, mass: 0.4 })

  useEffect(() => {
    if (!enabled) return

    document.documentElement.classList.add('s7-no-cursor')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!seen.current) {
        seen.current = true
        setVisible(true)
      }
      if (raf.current) return
      raf.current = requestAnimationFrame(() => {
        raf.current = 0
        const el = e.target instanceof Element ? e.target : null
        const target = el?.closest(
          '[data-cursor], a, button, input, textarea, select, [role="button"]',
        )
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
  }, [enabled, x, y])

  if (!enabled) return null

  const isView = mode === 'view'
  const size = isView ? 92 : mode === 'link' ? 64 : 32

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] hidden lg:block">
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full will-change-transform"
        style={{
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
          // Discrete properties — set, never animated.
          mixBlendMode: isView ? 'normal' : 'difference',
          backgroundColor: isView ? '#E50914' : '#ffffff',
        }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          scale: down ? 0.86 : 1,
        }}
        transition={{ duration: 0.32, ease: EASE }}
      >
        <motion.span
          className="font-sans text-[0.5625rem] font-semibold tracking-[0.18em] text-white uppercase"
          animate={{ opacity: isView ? 1 : 0 }}
          transition={{ duration: 0.18 }}
        >
          View
        </motion.span>
      </motion.div>
    </div>
  )
}
