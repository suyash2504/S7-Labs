import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ServiceGlyph } from '@/components/ui/ServiceGlyph'
import { Button } from '@/components/ui/Button'
import { services } from '@/data/services'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Full-width expandable service rows.
 * Hover = preview state (accent, glyph, motion). Click/Enter = expand the
 * detail panel. Exactly one row is open at a time.
 */
export function Services() {
  const [open, setOpen] = useState(services[0].id)

  return (
    <Section id="services" tone="carbon">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="Services"
          title="What We Do"
          lede="Five disciplines. Most projects need more than one."
        />

        <div className="mt-16 sm:mt-20">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.05}>
              <ServiceRow
                service={service}
                isOpen={open === service.id}
                onToggle={() => setOpen(open === service.id ? null : service.id)}
              />
            </Reveal>
          ))}
          <div className="hairline" />
        </div>

        <Reveal delay={0.1} className="mt-14 flex flex-wrap items-center gap-6 sm:mt-16">
          <Button to="/contact" variant="secondary" icon="up">
            Discuss your project
          </Button>
          <p className="max-w-sm text-sm text-smoke">
            Not sure which you need? Tell us the problem — we&rsquo;ll tell you the scope.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}

function ServiceRow({ service, isOpen, onToggle }) {
  const [hovered, setHovered] = useState(false)
  const lit = hovered || isOpen

  return (
    <div
      className="group relative border-t border-line"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background wash on hover/open */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/[0.035] to-transparent"
        initial={false}
        animate={{ opacity: lit ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      {/* Red indicator that grows from the left edge */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-px origin-left bg-red"
        initial={false}
        animate={{ scaleX: lit ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ width: '100%' }}
      />

      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`service-panel-${service.id}`}
          className="relative flex w-full cursor-pointer items-center gap-5 py-7 text-left sm:gap-8 sm:py-9 lg:py-11"
        >
          <span
            className={cn(
              'shrink-0 font-mono text-[0.6875rem] tracking-[0.2em] transition-colors duration-400',
              lit ? 'text-red-bright' : 'text-smoke',
            )}
          >
            {service.number}
          </span>

          <motion.span
            className="flex-1 font-display text-d3 uppercase transition-colors duration-400"
            animate={{ x: lit ? 10 : 0, color: lit ? '#ffffff' : '#a3a3a3' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {service.title}
          </motion.span>

          {/* Glyph preview — appears on hover, desktop only */}
          <span className="pointer-events-none absolute right-16 hidden h-20 w-20 lg:block xl:right-24">
            <motion.span
              className="block h-full w-full"
              initial={false}
              animate={{ opacity: lit ? 1 : 0, scale: lit ? 1 : 0.82, rotate: lit ? 0 : -12 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <ServiceGlyph name={service.glyph} className="h-full w-full" />
            </motion.span>
          </span>

          <motion.span
            aria-hidden="true"
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-400 sm:size-11',
              lit ? 'border-red/60 text-red-bright' : 'border-line text-smoke',
            )}
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Plus strokeWidth={1.5} className="size-4" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`service-panel-${service.id}`}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative overflow-hidden"
          >
            <div className="grid gap-8 pb-10 sm:pb-12 lg:grid-cols-12 lg:gap-12">
              <p className="text-lead text-chalk lg:col-span-5 lg:col-start-2">
                {service.summary}
              </p>
              <div className="lg:col-span-5 lg:col-start-8">
                <p className="text-base leading-relaxed text-ash">{service.detail}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="label border border-line px-3 py-1.5 text-smoke"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
