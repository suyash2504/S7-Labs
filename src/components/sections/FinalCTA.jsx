import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Reveal, RevealLines } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { site, whatsappUrl, hasWhatsApp } from '@/data/site'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * The climax. One idea, one line, one button — with a red bloom that grows
 * as the section rises into view.
 */
export function FinalCTA() {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const glow = useTransform(scrollYProgress, [0, 1], [0.35, 1])
  const rise = useTransform(scrollYProgress, [0, 1], [40, 0])

  return (
    <section
      ref={ref}
      id="contact-cta"
      className="relative isolate overflow-hidden border-t border-line py-32 sm:py-44 lg:py-56"
    >
      {/* Red radial bloom */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: reduced ? 0.85 : glow,
          background:
            'radial-gradient(58% 62% at 50% 48%, rgba(229,9,20,0.28) 0%, rgba(139,0,0,0.13) 36%, rgba(8,8,8,0) 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40"
        style={{
          maskImage: 'radial-gradient(58% 62% at 50% 60%, #000 0%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(58% 62% at 50% 60%, #000 0%, transparent 82%)',
        }}
      />

      <motion.div className="shell relative text-center" style={reduced ? undefined : { y: rise }}>
        <Reveal className="flex justify-center">
          <Eyebrow pulse>Have an idea?</Eyebrow>
        </Reveal>

        <RevealLines
          as="h2"
          delay={0.08}
          lines={[
            <>
              Let&rsquo;s <span className="text-red">build</span> it.
            </>,
          ]}
          className="mt-8 font-display text-[clamp(3rem,13vw,10rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase sm:mt-10"
        />

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-md text-lead text-ash sm:mt-10">
            Tell us what you&rsquo;re working on. We&rsquo;ll figure out the rest.
          </p>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:mt-14 sm:flex-row sm:gap-4">
            <Button to="/contact" size="lg" icon="up">
              Start a Project
            </Button>
            {hasWhatsApp && (
              <Button href={whatsappUrl()} variant="secondary" size="lg" icon="up">
                WhatsApp Us
              </Button>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.36}>
          <a
            href={`mailto:${site.email}`}
            className="group mt-12 inline-block font-mono text-xs tracking-[0.2em] text-smoke transition-colors hover:text-ash sm:mt-16"
          >
            <span className="border-b border-transparent pb-1 transition-colors group-hover:border-red">
              {site.email.toUpperCase()}
            </span>
          </a>
        </Reveal>
      </motion.div>
    </section>
  )
}
