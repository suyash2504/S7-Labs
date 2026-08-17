import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * Editorial scroll-linked type: words resolve from near-invisible to full
 * contrast as the block travels through the viewport.
 *
 * Highlighted words (matched case-insensitively against `accent`) resolve to
 * red instead of white.
 */
export function ScrollWords({
  text,
  accent = [],
  className,
  wordClassName = 'text-chalk',
  accentClassName = 'text-red',
  offset,
}) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset ?? ['start 0.9', 'end 0.55'],
  })

  const words = text.split(' ')
  const accentSet = new Set(accent.map((w) => w.toLowerCase()))

  return (
    <span ref={ref} className={cn('inline', className)}>
      {words.map((word, i) => {
        const start = (i / words.length) * 0.85
        const end = start + 0.28
        return (
          // The literal space keeps the accessible text readable — without it
          // the DOM reads "Wedon'tjustbuildwebsites."
          <span key={`${word}-${i}`}>
            <Word
              progress={scrollYProgress}
              range={[start, end]}
              reduced={reduced}
              className={
                accentSet.has(word.toLowerCase().replace(/[^a-z']/g, ''))
                  ? accentClassName
                  : wordClassName
              }
            >
              {word}
            </Word>{' '}
          </span>
        )
      })}
    </span>
  )
}

function Word({ children, progress, range, reduced, className }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={reduced ? undefined : { opacity }} className={cn('inline-block', className)}>
      {children}
    </motion.span>
  )
}
