import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Lock } from 'lucide-react'
import { ProjectVisual } from '@/components/ui/ProjectVisual'
import { Reveal } from '@/components/ui/Reveal'
import { EASE, pointerSpring } from '@/lib/motion'
import { useHasPointer, usePrefersReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/cn'

/**
 * A single project presented as an editorial spread: oversized media on one
 * side, oversized type on the other, alternating sides down the page.
 * The media parallaxes against the pointer; nothing moves on touch devices.
 */
export function ProjectCard({ project, flip = false, delay = 0, priority = false }) {
  const reduced = usePrefersReducedMotion()
  const hasPointer = useHasPointer()
  const interactive = hasPointer && !reduced

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, pointerSpring)
  const sy = useSpring(my, pointerSpring)
  const x = useTransform(sx, (v) => v * 22)
  const y = useTransform(sy, (v) => v * 22)

  const onMove = (e) => {
    if (!interactive) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const upcoming = project.status === 'upcoming'
  const Wrapper = upcoming ? 'div' : Link

  return (
    <article>
      <Wrapper
        {...(upcoming ? {} : { to: `/work/${project.slug}`, 'data-cursor': 'view' })}
        className={cn(
          'group grid items-center gap-8 lg:grid-cols-12 lg:gap-14',
          upcoming && 'cursor-default',
        )}
        aria-label={upcoming ? undefined : `${project.title} — view case study`}
      >
        {/* ---------------------------------------------------------- media */}
        <Reveal
          delay={delay}
          className={cn(
            'lg:col-span-7',
            flip ? 'lg:order-2 lg:col-start-6' : 'lg:order-1 lg:col-start-1',
          )}
        >
          <div
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className="relative aspect-4/3 overflow-hidden border border-line bg-carbon sm:aspect-video lg:aspect-4/3"
          >
            <motion.div
              className="absolute inset-[-7%]"
              style={interactive ? { x, y } : undefined}
            >
              <motion.div
                className="h-full w-full"
                initial={false}
                whileHover={interactive ? { scale: 1.045 } : undefined}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <ProjectVisual project={project} priority={priority} />
              </motion.div>
            </motion.div>

            {/* Vignette keeps the metadata legible over any composition. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-void/70 via-transparent to-void/25"
            />

            {/* Corner metadata */}
            <span className="pointer-events-none absolute top-4 left-4 flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.2em] text-ash sm:top-6 sm:left-6">
              <span className={cn('size-1', upcoming ? 'bg-smoke' : 'bg-red')} />
              {upcoming ? 'IN THE PIPELINE' : `PROJECT ${project.number}`}
            </span>
            <span className="pointer-events-none absolute right-4 bottom-4 font-mono text-[0.625rem] tracking-[0.2em] text-smoke sm:right-6 sm:bottom-6">
              {project.year}
            </span>

            {/* Red edge that draws in on hover */}
            {!upcoming && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-red transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
              />
            )}
          </div>
        </Reveal>

        {/* ----------------------------------------------------------- text */}
        <Reveal
          delay={delay + 0.08}
          className={cn(
            'lg:col-span-4',
            flip ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-9',
          )}
        >
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-14 -left-2 hidden font-display text-[7rem] leading-none font-bold text-white/[0.035] lg:block"
            >
              {project.number}
            </span>

            <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-smoke uppercase">
              {project.category}
            </p>

            <h3 className="relative mt-4 font-display text-d2 uppercase">
              <span className="relative inline-block">
                <span
                  className={cn(
                    'transition-colors duration-500',
                    upcoming ? 'text-smoke' : 'text-chalk',
                  )}
                >
                  {project.title}
                </span>
                {!upcoming && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-0.5 w-full origin-right scale-x-0 bg-red transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100"
                  />
                )}
              </span>
            </h3>

            {project.subtitle && (
              <p className="mt-3 text-sm text-smoke">{project.subtitle}</p>
            )}

            {project.summary && (
              <p className="mt-6 max-w-md text-base leading-relaxed text-ash">
                {project.summary}
              </p>
            )}

            {project.disciplines && (
              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {project.disciplines.map((d) => (
                  <li key={d} className="label text-smoke">
                    {d}
                  </li>
                ))}
              </ul>
            )}

            <span
              className={cn(
                'mt-9 inline-flex items-center gap-3 text-sm font-medium',
                upcoming ? 'text-smoke' : 'text-chalk',
              )}
            >
              {upcoming ? (
                <>
                  <Lock aria-hidden="true" strokeWidth={1.5} className="size-3.5" />
                  Coming soon
                </>
              ) : (
                <>
                  View case study
                  <span className="flex size-9 items-center justify-center rounded-full border border-line transition-colors duration-400 group-hover:border-red group-hover:bg-red group-hover:text-white">
                    <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  </span>
                </>
              )}
            </span>
          </div>
        </Reveal>
      </Wrapper>
    </article>
  )
}
