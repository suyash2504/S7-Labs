import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeroVisual } from '@/components/hero/HeroVisual'
import { Button } from '@/components/ui/Button'
import { RevealLines } from '@/components/ui/Reveal'
import { EASE } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/lib/hooks'

/* Cinematic load choreography. One place to retime the whole opening. */
const T = {
  eyebrow: 0.2,
  heading: 0.38,
  headingStep: 0.1,
  glow: 1.0,
  copy: 0.98,
  actions: 1.12,
  meta: 1.35,
  visual: 0.3,
}

export function Hero() {
  const reduced = usePrefersReducedMotion()
  const [play, setPlay] = useState(false)

  // Wait for the first paint (and the font swap) before starting, so the
  // headline never reveals into a fallback face.
  useEffect(() => {
    let cancelled = false
    const go = () => !cancelled && setPlay(true)
    const t = setTimeout(go, 120)
    if (document.fonts?.ready) document.fonts.ready.then(() => setTimeout(go, 60))
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [])

  const lines = [
    'THINK.',
    'BUILD.',
    <motion.span
      key="evolve"
      className="inline-block text-red"
      initial={{ textShadow: '0 0 0px rgba(229,9,20,0)' }}
      animate={play ? { textShadow: '0 0 46px rgba(229,9,20,0.42)' } : undefined}
      transition={{ duration: 1.4, delay: T.glow, ease: EASE }}
    >
      EVOLVE.
    </motion.span>,
  ]

  return (
    <section
      /* On phones the hero stops one ticker-height short of the viewport, so
         the capability strip is already on screen at rest. There is room:
         the hero's own content is ~450px tall in a ~810px viewport. From sm
         the hero takes the full screen again and the ticker sits below the
         fold, where the scroll cue invites you to it. */
      className="relative flex min-h-[calc(100svh-var(--ticker-h))] items-center overflow-hidden pt-28 pb-20 sm:min-h-[100svh] sm:pt-32 lg:pt-24 lg:pb-24"
      aria-label="S7 Labs — Think. Build. Evolve."
    >
      {/* --- Visual field ------------------------------------------------
          Below lg the headline needs the full width, so the sculpture is
          pushed up and off the right edge at low opacity — atmosphere behind
          the type, never an object competing with it. Centring it here puts
          the lattice straight through "EVOLVE." and the buttons.
          From lg it takes the right half properly and bleeds off the edge. */}
      <div
        className="pointer-events-none absolute top-[2%] right-[-30%] bottom-[28%] left-[24%] opacity-30 sm:right-[-14%] sm:bottom-[24%] sm:left-[34%] sm:opacity-40 lg:inset-y-0 lg:right-[-6%] lg:left-auto lg:w-[58%] lg:opacity-100 xl:right-[-3%] xl:w-[54%]"
      >
        <HeroVisual active={play} reduced={reduced} />
      </div>

      <div className="shell relative z-10 w-full">
        <div className="max-w-[46rem] lg:max-w-[38rem] xl:max-w-[44rem]">
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={play ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: T.eyebrow, ease: EASE }}
          >
            <span aria-hidden="true" className="h-px w-8 bg-red sm:w-12" />
            <span className="label text-ash">S7 Labs / Digital Studio</span>
          </motion.div>

          {/* Headline */}
          <RevealLines
            as="h1"
            lines={lines}
            play={play}
            delay={T.heading}
            step={T.headingStep}
            className="mt-7 font-display text-hero text-chalk uppercase sm:mt-8"
          />

          {/* Supporting copy */}
          <motion.p
            className="mt-8 max-w-[34rem] text-lead text-ash sm:mt-10"
            initial={{ opacity: 0, y: 18 }}
            animate={play ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: T.copy, ease: EASE }}
          >
            We design and build digital experiences that help ambitious businesses stand out,
            connect and grow.
          </motion.p>

          {/* Actions */}
          <motion.div
            className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center sm:gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={play ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: T.actions, ease: EASE }}
          >
            <Button to="/work" size="lg" icon="right">
              Explore Our Work
            </Button>
            <Button to="/contact" variant="secondary" size="lg" icon="up">
              Start a Project
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Baseline meta */}
      <motion.div
        className="shell absolute inset-x-0 bottom-6 z-10 hidden items-end justify-between sm:flex"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: T.meta, ease: EASE }}
      >
        <ScrollCue reduced={reduced} />
        <span className="label text-smoke">Raipur, India</span>
      </motion.div>
    </section>
  )
}

function ScrollCue({ reduced }) {
  return (
    <span className="flex items-center gap-3 text-smoke" aria-hidden="true">
      <span className="relative h-8 w-px overflow-hidden bg-line">
        {!reduced && (
          <motion.span
            className="absolute inset-x-0 h-3 bg-red"
            initial={{ y: -14 }}
            animate={{ y: 34 }}
            transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.12 }}
          />
        )}
      </span>
      <span className="label">Scroll</span>
    </span>
  )
}
