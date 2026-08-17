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

/**
 * The section marker used across the site: an oversized outlined counter with
 * the label set beside its baseline.
 *
 * It replaced a `(02)` in 11px muted mono next to an 11px muted label — both
 * so quiet that readers lost track of which section they were in. The number
 * is decorative sequencing, so it's hidden from assistive tech; the label
 * carries the meaning.
 */
export function SectionMark({ index, children, className }) {
  return (
    <span className={cn('flex items-end gap-3.5 sm:gap-4', className)}>
      {index && (
        <span
          aria-hidden="true"
          className="font-display text-[2.5rem] leading-[0.76] font-bold text-transparent select-none sm:text-[3.25rem]"
          // Lighter than --color-line: at 1px on near-black the token outline
          // all but vanishes at this size.
          style={{ WebkitTextStroke: '1.5px #3a3a3a' }}
        >
          {index}
        </span>
      )}
      <span className="pb-1 font-sans text-[0.6875rem] font-bold tracking-[0.24em] text-chalk uppercase sm:text-xs">
        {children}
      </span>
    </span>
  )
}
