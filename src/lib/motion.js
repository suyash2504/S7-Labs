/**
 * Shared Framer Motion variants + easing.
 * Components import from here instead of redefining transitions inline, so the
 * whole site moves with one vocabulary.
 *
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user">
 * in App.jsx — these variants do not need to branch.
 */

export const EASE = [0.16, 1, 0.3, 1] // expo-out
export const EASE_IN_OUT = [0.83, 0, 0.17, 1] // quint

/** Standard scroll-reveal viewport config: fires once, slightly early. */
export const viewport = { once: true, margin: '-12% 0px -12% 0px' }

/** Fade + rise. `custom` = delay in seconds. */
export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: d, ease: EASE },
  }),
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: (d = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, delay: d, ease: EASE },
  }),
}

/** Wrap in `overflow-hidden` — the child slides up from its own bounding box. */
export const lineReveal = {
  hidden: { y: '110%' },
  show: (d = 0) => ({
    y: '0%',
    transition: { duration: 0.95, delay: d, ease: EASE },
  }),
}

/** Horizontal rule that draws itself in. */
export const drawLine = {
  hidden: { scaleX: 0 },
  show: (d = 0) => ({
    scaleX: 1,
    transition: { duration: 1.1, delay: d, ease: EASE },
  }),
}

/** Parent orchestrator. Pass `custom` to offset the whole group. */
export const stagger = (step = 0.08, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: step, delayChildren: delay },
  },
})

/** Page-level transition used by <PageTransition>. Fast and unobtrusive. */
export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeIn' } },
}

/** Spring used for cursor + magnetic elements. */
export const pointerSpring = { stiffness: 320, damping: 30, mass: 0.55 }
