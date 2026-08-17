import { Marquee } from '@/components/ui/Marquee'
import { tickerItems } from '@/data/site'

/** Slow full-bleed capability strip directly beneath the hero. */
export function ServicesTicker() {
  return (
    <div className="relative border-y border-line bg-carbon py-6 sm:py-8">
      <Marquee
        items={tickerItems}
        duration={52}
        itemClassName="font-display text-[clamp(1.25rem,3.4vw,2.25rem)] font-medium uppercase tracking-[-0.02em] text-ash transition-colors duration-500 hover:text-chalk"
        separator={<span className="block size-1.5 rotate-45 bg-red" />}
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
