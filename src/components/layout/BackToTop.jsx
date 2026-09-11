import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Floating back-to-top control, pinned bottom-right on every page.
 *
 * It used to sit in the footer's baseline row, which meant it only appeared
 * once a visitor had already reached the bottom — the one place they least
 * needed it. It now floats and is always visible. There is deliberately no
 * scroll threshold: a threshold tied to viewport height silently never
 * triggers on short pages when the window is tall.
 *
 * Same identity as the footer control it replaces — red outline, up arrow —
 * but without that control's pulsing halo. A halo that pulsed only at the
 * footer was an accent; one pulsing in the corner of every screen is a
 * permanent distraction the headline has to compete with.
 *
 * z-50 keeps it under the navbar (60), mobile menu (70) and cursor (200), so
 * an open menu covers it rather than the other way round.
 *
 * The bottom offset clears what the hero parks at the lower edge of the
 * viewport. On phones the capability ticker fills the last --ticker-h of the
 * first screen, so the button sits one ticker-height up. From sm the ticker
 * drops below the fold, but the hero's "Raipur, India" label sits at bottom-6,
 * and at tablet widths bottom-8 put the button directly on top of it.
 */
export function BackToTop({ className }) {
  const toTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      title="Back to top"
      className={cn(
        'group fixed right-5 bottom-[calc(var(--ticker-h)+0.75rem)] z-50 flex size-11 cursor-pointer items-center justify-center',
        'border border-red bg-void/85 text-chalk backdrop-blur-md',
        'transition-colors duration-400 ease-[var(--ease-out-expo)]',
        'hover:bg-red focus-visible:bg-red',
        'sm:right-8 sm:bottom-14',
        className,
      )}
    >
      <ArrowUp
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-4 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5"
      />
    </button>
  )
}
