import { useRef } from 'react'
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

  // Measured against the media box, but listened for on <article>: the
  // stretched link's ::after sits over the media and would swallow the event
  // if we bound it there. Pointer events still bubble up to the article.
  const mediaRef = useRef(null)

  const onMove = (e) => {
    if (!interactive || !mediaRef.current) return
    const r = mediaRef.current.getBoundingClientRect()
    const clamp = (v) => (v > 1 ? 1 : v < -1 ? -1 : v)
    mx.set(clamp(((e.clientX - r.left) / r.width) * 2 - 1))
    my.set(clamp(((e.clientY - r.top) / r.height) * 2 - 1))
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const upcoming = project.status === 'upcoming'

  return (
    /**
     * Stretched-link card. The anchor wraps only the title and is expanded to
     * cover the whole card via its own ::after, so the entire surface stays
     * clickable while the accessible name is just "Apex Gym".
     *
     * Wrapping the whole card in the <a> instead (the obvious approach) makes
     * every paragraph inside it part of the link's name — which reads terribly
     * in a screen reader and fails WCAG 2.5.3, since no short aria-label can
     * contain all of that visible text.
     */
    <article className="group relative" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        className={cn(
          'grid items-center gap-8 lg:grid-cols-12 lg:gap-14',
          upcoming && 'cursor-default',
        )}
      >
        {/* ---------------------------------------------------------- media */}
        <Reveal
          delay={delay}
          className={cn(
            'lg:col-span-7',
            flip ? 'lg:order-2 lg:col-start-6' : 'lg:order-1 lg:col-start-1',
          )}
        >
          <MediaLink upcoming={upcoming} to={`/work/${project.slug}`}>
          <div
            ref={mediaRef}
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

            {/* Says plainly that this was self-initiated rather than client
                work. The build is real either way; the relationship isn't. */}
            {project.kind === 'concept' && (
              <span className="pointer-events-none absolute top-4 right-4 border border-line bg-void/70 px-2.5 py-1 font-mono text-[0.5625rem] tracking-[0.2em] text-ash backdrop-blur-sm sm:top-6 sm:right-6">
                CONCEPT
              </span>
            )}

            {/* Red edge that draws in on hover */}
            {!upcoming && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-red transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
              />
            )}
          </div>
          </MediaLink>
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
              <LinkOrText
                upcoming={upcoming}
                to={`/work/${project.slug}`}
                className="relative inline-block"
              >
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
              </LinkOrText>
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
      </div>
    </article>
  )
}

/**
 * The title: a link for published projects, plain text for upcoming ones.
 * This is the card's single entry in the accessibility tree, and its name is
 * exactly the visible title.
 *
 * A stretched `::after` was the first attempt at making the whole card
 * clickable, but the pseudo-element resolves against the nearest positioned or
 * transformed ancestor — which here is the Reveal wrapper mid-animation, not
 * the card. <MediaLink> handles the click target instead.
 */
function LinkOrText({ upcoming, to, className, children }) {
  if (upcoming) return <span className={className}>{children}</span>
  return (
    <Link to={to} data-cursor="view" className={className}>
      {children}
    </Link>
  )
}

/**
 * Makes the artwork clickable for pointer users without adding a second entry
 * to the accessibility tree — keyboard and screen-reader users reach the
 * project through the title link above, so this one is skipped entirely.
 */
function MediaLink({ upcoming, to, children }) {
  if (upcoming) return children
  return (
    <Link to={to} data-cursor="view" aria-hidden="true" tabIndex={-1} className="block">
      {children}
    </Link>
  )
}
