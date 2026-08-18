import { Marquee } from '@/components/ui/Marquee'
import { tickerItems } from '@/data/site'

/** Slow full-bleed capability strip directly beneath the hero. */
export function ServicesTicker() {
  return (
    /* Fixed height below sm so the hero can subtract exactly this much from
       100svh (see --ticker-h). From sm it goes back to padding-driven. */
    <div className="relative flex h-[var(--ticker-h)] items-center border-y border-line bg-carbon sm:h-auto sm:py-4">
      <Marquee
        items={tickerItems}
        duration={26}
        className="w-full"
        itemClassName="font-display text-[clamp(0.875rem,1.9vw,1.25rem)] font-medium uppercase tracking-[-0.02em] text-ash transition-colors duration-500 hover:text-chalk"
        separator={<span className="block size-1 rotate-45 bg-red" />}
      />

      {/* Fade the strip into the page at both ends. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-carbon to-transparent sm:w-32"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-carbon to-transparent sm:w-32"
      />
    </div>
  )
}
