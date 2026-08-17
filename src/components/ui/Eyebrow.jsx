import { cn } from '@/lib/cn'

/**
 * `S7 LABS / DIGITAL STUDIO` style overline.
 * `marker` draws the small red indicator that recurs across the site.
 */
export function Eyebrow({ children, className, marker = true, pulse = false }) {
  return (
    <span className={cn('label inline-flex items-center gap-3 text-smoke', className)}>
      {marker && (
        <span
          aria-hidden="true"
          className={cn('size-[5px] shrink-0 bg-red', pulse && 'animate-pulse-dot')}
        />
      )}
      <span className="text-ash">{children}</span>
    </span>
  )
}

/** Section counter — `(02)` style, monospace, muted. */
export function SectionIndex({ children, className }) {
  return (
    <span className={cn('font-mono text-[0.6875rem] tracking-[0.2em] text-smoke', className)}>
      {children}
    </span>
  )
}
