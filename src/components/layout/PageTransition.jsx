import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion'

/** Fast, minimal route transition. No loader, no curtain. */
export function PageTransition({ children, className }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  )
}
