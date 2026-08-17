import { useRef } from 'react'
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import { Section } from '@/components/ui/SectionHeading'
import { Reveal, LineRule } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Eyebrow'
import { processStages } from '@/data/process'
import { EASE, viewport } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * ---------------------------------------------------------------------------
 * SIGNATURE SECTION — THINK → BUILD → EVOLVE
 * ---------------------------------------------------------------------------
 * A single red line runs the height of the section and fills as you scroll.
 * Each stage title starts as outlined type and solidifies when its node is
 * reached — so progress through the process is legible at a glance.
 * ---------------------------------------------------------------------------
 */
export function Process() {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.68', 'end 0.72'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })
  const scaleY = useTransform(reduced ? scrollYProgress : smooth, [0, 1], [0, 1])

  return (
    // `overflow-x-clip`, never `overflow-hidden`: `hidden` makes this element a
    // scroll container, which Framer's useScroll then measures against — the
    // rail's progress pins at 1 and the line never draws. `clip` doesn't.
    <Section id="process" className="overflow-x-clip">
      <div className="shell">
        <LineRule className="mb-8 sm:mb-10" />
        <Reveal className="flex flex-wrap items-end gap-5">
          <SectionMark index="04">The S7 Method</SectionMark>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-line sm:block sm:mb-2" />
          <span className="label hidden text-smoke lg:inline lg:mb-1">Think → Build → Evolve</span>
        </Reveal>

        <div ref={ref} className="relative mt-16 sm:mt-24">
          {/* The rail */}
          <div
            aria-hidden="true"
            className="absolute top-3 bottom-0 left-[3px] w-px bg-line sm:left-[5px]"
          >
            <motion.div
              className="h-full w-full origin-top bg-linear-to-b from-red-bright via-red to-red-deep"
              style={{ scaleY }}
            />
            <motion.div
              className="absolute inset-0 h-full w-px origin-top bg-red blur-[3px]"
              style={{ scaleY, opacity: 0.7 }}
            />
          </div>

          <ol className="relative">
            {processStages.map((stage, i) => (
              <Stage key={stage.id} stage={stage} index={i} total={processStages.length} />
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}

function Stage({ stage, index, total }) {
  const ref = useRef(null)
  // A narrow band (e.g. -50%/-40%) leaves only ~10% of the viewport as the
  // trigger zone — fast scrolling or an anchor jump can skip it entirely, and
  // with `once: true` the stage would stay outlined forever. Keep it generous.
  const active = useInView(ref, { once: true, margin: '-25% 0px -25% 0px' })

  return (
    <li
      ref={ref}
      className="relative pb-20 pl-10 last:pb-0 sm:pb-28 sm:pl-16 lg:pb-36 lg:pl-28"
    >
      {/* Node */}
      <span aria-hidden="true" className="absolute top-2 left-0 sm:top-3">
        <motion.span
          className="block size-[7px] rounded-full sm:size-[11px]"
          initial={{ backgroundColor: '#242424', scale: 0.7 }}
          animate={
            active
              ? {
                  backgroundColor: '#E50914',
                  scale: 1,
                  boxShadow: '0 0 0 4px rgba(229,9,20,0.16)',
                }
              : {}
          }
          transition={{ duration: 0.6, ease: EASE }}
        />
      </span>

      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-smoke">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>

      {/* Outlined → solid title */}
      <h3
        className="mt-5 font-display text-d1 uppercase sm:mt-7"
        style={{
          color: active ? 'var(--color-chalk)' : 'transparent',
          WebkitTextStroke: '1px',
          // #242424 would be nearly invisible — the outlined state still has to
          // clear 3:1 for large text in case a stage is never scrolled into view.
          WebkitTextStrokeColor: active ? 'transparent' : 'var(--color-smoke-deep)',
          transition:
            'color 900ms cubic-bezier(0.16,1,0.3,1), -webkit-text-stroke-color 900ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {stage.title}
      </h3>

      <div className="mt-6 grid max-w-4xl gap-6 sm:mt-8 lg:grid-cols-12 lg:gap-12">
        <motion.p
          className="text-d3 tracking-tight text-chalk lg:col-span-5"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {stage.lead}
        </motion.p>

        <div className="lg:col-span-6 lg:col-start-7">
          <motion.p
            className="text-lead text-ash"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            {stage.body}
          </motion.p>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {stage.steps.map((step, i) => (
              <motion.li
                key={step}
                className="label flex items-center gap-2 text-smoke"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewport}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: EASE }}
              >
                <span aria-hidden="true" className="size-[3px] bg-red" />
                {step}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}
