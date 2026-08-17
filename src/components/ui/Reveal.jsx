import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { fadeUp, fadeIn, lineReveal, drawLine, viewport } from '@/lib/motion'

/** Fade + rise on scroll. The workhorse reveal. */
export function Reveal({ children, delay = 0, className, as = 'div', once = true, ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ ...viewport, once }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Opacity-only reveal — for large visuals where a translate would feel heavy. */
export function FadeIn({ children, delay = 0, className, ...rest }) {
  return (
    <motion.div
      variants={fadeIn}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * Masked line-by-line heading reveal.
 * Pass `lines` as an array of strings, or nodes for per-line styling:
 *   <RevealLines lines={['THINK.', 'BUILD.', <em key="e">EVOLVE.</em>]} />
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  as: Tag = 'h2',
  delay = 0,
  step = 0.09,
  play, // undefined → scroll-triggered; true/false → controlled (hero load)
}) {
  const controlled = typeof play === 'boolean'

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={cn('block will-change-transform', lineClassName)}
            variants={lineReveal}
            custom={delay + i * step}
            initial="hidden"
            {...(controlled
              ? { animate: play ? 'show' : 'hidden' }
              : { whileInView: 'show', viewport })}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Hairline that draws itself left→right when scrolled into view. */
export function LineRule({ className, delay = 0, accent = false }) {
  return (
    <motion.div
      variants={drawLine}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={cn('h-px w-full origin-left', accent ? 'bg-red' : 'bg-line', className)}
    />
  )
}
