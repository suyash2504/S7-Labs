import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useMagnetic } from '@/lib/useMagnetic'
import { usePrefersReducedMotion } from '@/lib/hooks'

const VARIANTS = {
  /* Solid white block that flips to red on hover — the loudest thing we do. */
  primary:
    'bg-chalk text-void border border-chalk hover:bg-red hover:border-red hover:text-white',
  /* Hairline outline that warms up to red. */
  secondary:
    'bg-transparent text-chalk border border-line hover:border-red/70 hover:text-white hover:bg-red/[0.07]',
  /* Inverted — used on light/red-glow surfaces. */
  ghost:
    'bg-transparent text-ash border border-transparent hover:text-chalk hover:border-line',
}

const SIZES = {
  sm: 'h-10 px-4 text-[0.8125rem]',
  md: 'h-12 px-6 text-sm sm:h-[3.25rem] sm:px-7',
  lg: 'h-[3.25rem] px-7 text-sm sm:h-16 sm:px-9 sm:text-[0.9375rem]',
}

const ICONS = { right: ArrowRight, up: ArrowUpRight, none: null }

/**
 * Hover-scramble label.
 *
 * Two stacked copies: a transparent one holding the real text (which supplies
 * both the accessible name and a fixed width) and a decorative overlay showing
 * the scrambling characters. Without the width holder the button visibly
 * jitters while scrambling, because the label is set in a proportional face.
 */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/*'

function ScrambleLabel({ text, active }) {
  const [out, setOut] = useState(text)
  const timer = useRef(null)

  useEffect(() => setOut(text), [text])
  useEffect(() => () => clearInterval(timer.current), [])

  useEffect(() => {
    clearInterval(timer.current)
    if (!active) {
      setOut(text)
      return
    }
    let frame = 0
    timer.current = setInterval(() => {
      setOut(
        text
          .split('')
          .map((c, i) =>
            c === ' '
              ? ' '
              : i < frame / 2
                ? text[i]
                : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0],
          )
          .join(''),
      )
      frame += 1
      if (frame / 2 > text.length) {
        clearInterval(timer.current)
        setOut(text)
      }
    }, 30)
    return () => clearInterval(timer.current)
  }, [active, text])

  return (
    <span className="relative z-10 inline-block">
      <span className="opacity-0">{text}</span>
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        {out}
      </span>
    </span>
  )
}

/**
 * The site's single button. Renders as <button>, <a> or react-router <Link>
 * depending on the props given — semantics stay correct in all three cases.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = 'right',
  to,
  href,
  className,
  magnetic = true,
  fullWidth = false,
  ...props
}) {
  const Icon = ICONS[icon]
  const { ref, x, y } = useMagnetic(magnetic ? 0.22 : 0)
  const wrapperClass = fullWidth ? 'flex w-full' : 'inline-flex'

  const reduced = usePrefersReducedMotion()
  const [hovered, setHovered] = useState(false)
  // Only plain-string labels can scramble; anything richer renders untouched.
  const canScramble = typeof children === 'string' && !reduced
  const hoverProps = canScramble
    ? { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) }
    : {}

  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2.5 rounded-[3px]',
    fullWidth && 'w-full',
    'font-sans font-medium tracking-[0.02em] whitespace-nowrap select-none',
    'transition-colors duration-300 ease-[var(--ease-out-expo)]',
    'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-red-bright',
    VARIANTS[variant],
    SIZES[size],
    className,
  )

  const inner = (
    <>
      {canScramble ? (
        <ScrambleLabel text={children} active={hovered} />
      ) : (
        <span className="relative z-10">{children}</span>
      )}
      {Icon && (
        <Icon
          aria-hidden="true"
          strokeWidth={1.75}
          className={cn(
            'relative z-10 size-4 transition-transform duration-400 ease-[var(--ease-out-expo)]',
            icon === 'right'
              ? 'group-hover:translate-x-1'
              : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
          )}
        />
      )}
    </>
  )

  const style = { x, y }

  if (to) {
    return (
      <motion.div ref={ref} style={style} className={wrapperClass}>
        <Link to={to} className={classes} {...hoverProps} {...props}>
          {inner}
        </Link>
      </motion.div>
    )
  }

  if (href) {
    const external = /^https?:|^mailto:|^tel:/.test(href)
    return (
      <motion.div ref={ref} style={style} className={wrapperClass}>
        <a
          href={href}
          className={classes}
          {...hoverProps}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...props}
        >
          {inner}
        </a>
      </motion.div>
    )
  }

  return (
    <motion.div ref={ref} style={style} className={wrapperClass}>
      <button type="button" className={classes} {...hoverProps} {...props}>
        {inner}
      </button>
    </motion.div>
  )
}

/**
 * Text link with an underline that wipes in from the left.
 */
export function TextLink({ children, to, href, className, icon = 'up', ...props }) {
  const Icon = ICONS[icon]
  const content = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-red transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100" />
      </span>
      {Icon && (
        <Icon
          aria-hidden="true"
          strokeWidth={1.75}
          className="size-3.5 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  )

  const classes = cn(
    'group inline-flex items-center gap-1.5 text-sm font-medium text-chalk transition-colors hover:text-white',
    className,
  )

  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )

  return (
    <a
      href={href}
      className={classes}
      {...(/^https?:/.test(href || '') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {content}
    </a>
  )
}
