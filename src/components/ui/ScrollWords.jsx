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
/* Words resolve from muted to full contrast as the block scrolls through.
   This interpolates COLOUR rather than opacity on purpose: a low opacity floor
   (0.14 was the first attempt) renders as #2b2b2b on #080808 — 1.4:1, and
   anyone landing mid-page or not scrolling at all is left with unreadable
   text. Starting at the muted token keeps every frame above 4.5:1. */
const FROM = '#7c7c7c' // --color-smoke, 4.7:1 on --color-void
const TO = '#ffffff'
const TO_ACCENT = '#ff3b45' // --color-red-bright, 5.7:1

export function ScrollWords({
  text,
  accent = [],
  className,
  from = FROM,
  to = TO,
  accentTo = TO_ACCENT,
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
              from={from}
              to={accentSet.has(word.toLowerCase().replace(/[^a-z']/g, '')) ? accentTo : to}
            >
              {word}
            </Word>{' '}
          </span>
        )
      })}
    </span>
  )
}

function Word({ children, progress, range, reduced, from, to }) {
  const color = useTransform(progress, range, [from, to])
  // Under reduced motion the word simply sits at its resolved colour.
  return (
    <motion.span style={reduced ? { color: to } : { color }} className="inline-block">
      {children}
    </motion.span>
  )
}
