import { motion, useScroll, useSpring } from 'framer-motion'

/** Hairline read-progress bar pinned under the navbar. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-px origin-left bg-linear-to-r from-red-deep via-red to-red-bright"
      style={{ scaleX }}
    />
  )
}
