import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { pricingTiers, pricingNote, pricingDisclaimer } from '@/data/pricing'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** Pricing preview — starting prices only, disclaimer always attached. */
export function Pricing() {
  return (
    <Section id="pricing" tone="carbon">
      <div className="shell">
        <SectionHeading
          index="07"
          eyebrow="Pricing"
          title="Where To Start"
          lede="Transparent starting points. The right number comes out of the conversation."
        />

        <div className="mt-16 grid gap-px border border-line bg-line sm:mt-20 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.id} delay={i * 0.08} className="h-full">
              <PricingCard tier={tier} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col gap-6 border border-line bg-card px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="size-1.5 shrink-0 bg-red" />
              <p className="font-display text-lg tracking-tight text-chalk sm:text-xl">
                {pricingNote}
              </p>
            </div>
            <Button to="/contact" size="sm" icon="right">
              Get a Quote
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-smoke">
            {pricingDisclaimer}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}

function PricingCard({ tier }) {
  return (
    <motion.div
      initial={false}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        'group relative flex h-full flex-col bg-void p-8 sm:p-10',
        tier.featured && 'bg-card',
      )}
    >
      {tier.featured && (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-red-deep via-red to-red-bright"
          />
          <span className="label absolute top-8 right-8 text-red-bright sm:top-10 sm:right-10">
            Popular
          </span>
        </>
      )}

      <h3 className="label text-ash">{tier.name}</h3>

      <p className="mt-7 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none font-bold tracking-tight text-chalk">
        {tier.price}
      </p>

      <p className="mt-5 text-base leading-relaxed text-ash">{tier.description}</p>

      <ul className="mt-9 flex-1 space-y-3.5 border-t border-line pt-8">
        {tier.includes.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-ash">
            <Check
              aria-hidden="true"
              strokeWidth={2}
              className={cn('mt-0.5 size-3.5 shrink-0', tier.featured ? 'text-red-bright' : 'text-smoke')}
            />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Button
          to="/contact"
          variant={tier.featured ? 'primary' : 'secondary'}
          size="sm"
          icon="right"
          magnetic={false}
          fullWidth
        >
          Get a Quote
        </Button>
      </div>
    </motion.div>
  )
}
