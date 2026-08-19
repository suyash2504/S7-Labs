import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, LineRule } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { ProjectCard } from '@/components/work/ProjectCard'
import { featuredProjects, upcomingProjects } from '@/data/projects'

/** SELECTED WORK — the reel on the home page. */
export function Portfolio() {
  return (
    <Section id="work">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Portfolio"
          title="Selected Work"
          lede="A few things we've designed and built."
        >
          <Reveal delay={0.1} className="hidden sm:block">
            <Button to="/work" variant="secondary" size="sm" icon="right">
              All work
            </Button>
          </Reveal>
        </SectionHeading>

        {/*
          A sample, not the archive. Each card is roughly a screen tall, so
          rendering every live project made the home page grow by a screen with
          each one shipped. Which three appear is set by `featured: true` in
          data/projects.js — an explicit choice rather than whatever happens to
          sit at the top of the file.
        */}
        <div className="mt-20 flex flex-col gap-24 sm:mt-28 sm:gap-32 lg:gap-40">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} flip={i % 2 === 1} priority={i === 0} />
          ))}
        </div>

        {/* Pipeline index — signals range without inventing finished work. */}
        <div className="mt-28 sm:mt-36">
          <LineRule />
          <Reveal className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="label text-ash">In the pipeline</h3>
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-smoke">
              {String(upcomingProjects.length).padStart(2, '0')} PROJECTS
            </span>
          </Reveal>

          <ul className="mt-8">
            {upcomingProjects.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.04}>
                <div className="flex items-baseline gap-5 border-t border-line py-5 sm:gap-8 sm:py-6">
                  <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-smoke">
                    {p.number}
                  </span>
                  <span className="flex-1 font-display text-lg tracking-tight text-ash uppercase sm:text-2xl">
                    {p.title}
                  </span>
                  <span className="hidden text-sm text-smoke sm:block">{p.category}</span>
                </div>
              </Reveal>
            ))}
            <li className="border-t border-line" />
          </ul>
        </div>

        <Reveal delay={0.1} className="mt-14 sm:hidden">
          <Link
            to="/work"
            className="group inline-flex items-center gap-3 text-sm font-medium text-chalk"
          >
            All work
            <span className="flex size-9 items-center justify-center rounded-full border border-line transition-colors group-hover:border-red group-hover:bg-red group-hover:text-white">
              <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </span>
          </Link>
        </Reveal>
      </div>
    </Section>
  )
}
