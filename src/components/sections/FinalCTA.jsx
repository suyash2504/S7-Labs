import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Reveal, RevealLines } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { site, whatsappUrl, hasWhatsApp } from '@/data/site'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * Random wander for the CTA bloom.
 *
 * Picks a random destination, eases toward it, and picks another the moment it
 * arrives — so the path never repeats. A fixed loop (circle, figure-8) reads as
 * mechanical once you've watched it twice.
 *
 * Drives `transform` on a pre-painted gradient rather than animating the
 * gradient's position: a moving `background-image` repaints a large area every
 * frame, a transform is composited.
 */
function useWanderingBloom(reduced) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    // Percentages of the layer, which is 240% x 190% of the section. Its
    // overhang is 70% / 45% of the section, so these stay safely inside that
    // and no edge of the gradient ever enters frame.
    const RANGE_X = 25
    const RANGE_Y = 20
    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    let raf = 0
    let onScreen = true

    const pick = () => {
      tx = (Math.random() * 2 - 1) * RANGE_X
      ty = (Math.random() * 2 - 1) * RANGE_Y
    }
    pick()

    const tick = () => {
      x += (tx - x) * 0.011
      y += (ty - y) * 0.011
      if (Math.abs(tx - x) < 0.7 && Math.abs(ty - y) < 0.7) pick()
      el.style.transform = `translate(calc(-50% + ${x.toFixed(2)}%), calc(-50% + ${y.toFixed(2)}%))`
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    start()

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting
        onScreen && !document.hidden ? start() : stop()
      },
      { threshold: 0 },
    )
    io.observe(el)

    const onVis = () => (document.hidden || !onScreen ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced])

  return ref
}

/**
 * The climax. One idea, one line, one button — with a red bloom that grows
 * as the section rises into view.
 */
export function FinalCTA() {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const bloomRef = useWanderingBloom(reduced)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const glow = useTransform(scrollYProgress, [0, 1], [0.35, 1])
  const rise = useTransform(scrollYProgress, [0, 1], [40, 0])

  return (
    <section
      ref={ref}
      id="contact-cta"
      className="relative isolate overflow-hidden border-t border-line py-32 sm:py-44 lg:py-56"
    >
      {/* Red bloom, wandering at random. Sized larger than the section so it
          never exposes an edge as it drifts. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{ opacity: reduced ? 0.85 : glow }}
      >
        {/* Deliberately no -translate-x-1/2 utilities here. Tailwind v4
            compiles those to the standalone CSS "translate" property, which
            composes with "transform" rather than replacing it — the layer ends
            up centred twice and drifts right out of frame. useWanderingBloom
            does the centring inside its own transform. */}
        <div
          ref={bloomRef}
          className="absolute top-1/2 left-1/2 h-[190%] w-[240%] will-change-transform"
          style={{
            background:
              'radial-gradient(21% 30% at 50% 50%, rgba(229,9,20,0.30) 0%, rgba(139,0,0,0.14) 38%, rgba(8,8,8,0) 72%)',
          }}
        />
      </motion.div>
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
