import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Clock } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { ProjectVisual } from '@/components/ui/ProjectVisual'
import { Reveal, RevealLines, FadeIn, LineRule } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Button } from '@/components/ui/Button'
import { getProject, getNextProject } from '@/data/projects'
import { useSeo } from '@/lib/useSeo'

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)

  useSeo({
    title: project ? project.title : 'Project not found',
    description: project?.summary,
    path: `/work/${slug}`,
  })

  if (!project || project.status !== 'live') return <Navigate to="/work" replace />

  const study = project.caseStudy ?? {}
  const next = getNextProject(project.slug)

  return (
    <PageTransition>
      {/* ------------------------------------------------------------ intro */}
      <header className="relative overflow-hidden pt-32 pb-14 sm:pt-40 lg:pt-48">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(42% 55% at 78% 4%, rgba(229,9,20,0.14) 0%, rgba(8,8,8,0) 66%)',
          }}
        />

        <div className="shell relative">
          <Reveal>
            <Link
              to="/work"
              className="group inline-flex items-center gap-2.5 text-sm text-ash transition-colors hover:text-chalk"
            >
              <ArrowLeft
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-4 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:-translate-x-1"
              />
              All work
            </Link>
          </Reveal>

          <Reveal delay={0.06} className="mt-12 flex items-center gap-5 sm:mt-16">
            <Eyebrow>Project {project.number}</Eyebrow>
          </Reveal>

          <RevealLines
            as="h1"
            delay={0.1}
            lines={[project.title]}
            className="mt-6 font-display text-d1 text-chalk uppercase"
          />

          <Reveal delay={0.2} className="mt-8">
            <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-smoke uppercase">
              {project.category} — {project.year}
            </p>
          </Reveal>
        </div>
      </header>

      {/* ------------------------------------------------------------ media */}
      <FadeIn className="shell">
        <div className="relative aspect-4/3 overflow-hidden border border-line bg-carbon sm:aspect-video">
          <ProjectVisual project={project} />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-void/55 via-transparent to-transparent"
          />
        </div>
      </FadeIn>

      {/* ------------------------------------------------------------- meta */}
      <section className="shell mt-16 sm:mt-24">
        <LineRule />
        <div className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <MetaBlock label="Client" items={[project.subtitle ?? project.title]} />
          <MetaBlock label="Services" items={study.deliverables ?? project.disciplines ?? []} />
          <MetaBlock label="Stack" items={study.stack ?? []} />
          <MetaBlock label="Year" items={[project.year]} />
        </div>
      </section>

      {/* ------------------------------------------------------------- body */}
      <section className="shell mt-24 sm:mt-32">
        {study.intro && (
          <Reveal>
            <p className="max-w-4xl text-[clamp(1.25rem,2.6vw,2rem)] leading-[1.45] tracking-[-0.015em] text-chalk">
              {study.intro}
            </p>
          </Reveal>
        )}

        {study.ready && study.facts && (
          <Reveal delay={0.08}>
            <dl className="mt-16 grid grid-cols-2 gap-px border border-line bg-line sm:mt-20 lg:grid-cols-4">
              {study.facts.map((f) => (
                <div key={f.label} className="bg-void px-6 py-8">
                  <dt className="label text-smoke">{f.label}</dt>
                  <dd className="mt-3 font-display text-lg tracking-tight text-chalk sm:text-xl">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {study.ready ? (
          <div className="mt-20 flex flex-col gap-16 sm:mt-28 sm:gap-24">
            {study.sections.map((section, i) => (
              <Reveal key={section.label} delay={0.04}>
                <div className="grid gap-6 border-t border-line pt-10 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-3">
                    <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-smoke">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-4 font-display text-d3 tracking-tight text-chalk">
                      {section.label}
                    </h2>
                  </div>
                  <p className="text-lead text-ash lg:col-span-8 lg:col-start-5">{section.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.08}>
            {/* Deliberately empty rather than filled with invented outcomes. */}
            <div className="mt-16 border border-line bg-card px-7 py-12 sm:mt-20 sm:px-12 sm:py-16">
              <span className="flex size-11 items-center justify-center border border-line text-smoke">
                <Clock aria-hidden="true" strokeWidth={1.5} className="size-5" />
              </span>
              <h2 className="mt-8 font-display text-d3 tracking-tight text-chalk">
                Full case study in progress
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ash">
                We&rsquo;re writing this one up properly — process, decisions and outcomes, with
                real numbers rather than placeholders. It&rsquo;ll be published here once the
                project has been live long enough to report on honestly.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button to="/contact" size="sm" icon="up">
                  Ask about this project
                </Button>
                <Button to="/work" variant="secondary" size="sm" icon="right">
                  Back to work
                </Button>
              </div>
            </div>
          </Reveal>
        )}

        {/* Screenshots of the live build. Each carries its own caption so the
            images argue for the work instead of just decorating the page. */}
        {study.gallery?.length > 0 && (
          <div className="mt-20 flex flex-col gap-16 sm:mt-28 sm:gap-24">
            {study.gallery.map((shot, i) => (
              <FadeIn key={shot.src}>
                <figure>
                  <div className="overflow-hidden border border-line bg-carbon">
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      loading="lazy"
                      decoding="async"
                      width="1920"
                      height="1200"
                      className="block w-full"
                    />
                  </div>
                  <figcaption className="mt-5 flex gap-5">
                    <span className="shrink-0 font-mono text-[0.6875rem] tracking-[0.2em] text-smoke">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="max-w-2xl text-sm leading-relaxed text-ash">
                      {shot.caption}
                    </span>
                  </figcaption>
                </figure>
              </FadeIn>
            ))}
          </div>
        )}

        {study.link && (
          <Reveal delay={0.1} className="mt-16">
            <Button href={study.link} variant="secondary" icon="up">
              Visit live site
            </Button>
          </Reveal>
        )}
      </section>

      {/* ------------------------------------------------------- next project */}
      {next && next.slug !== project.slug && (
        <section className="mt-28 border-t border-line sm:mt-40">
          <Link
            to={`/work/${next.slug}`}
            data-cursor="view"
            className="group block py-20 transition-colors duration-500 hover:bg-carbon sm:py-28"
          >
            <div className="shell flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="label text-smoke">Next project</span>
                <h2 className="mt-5 font-display text-d1 text-chalk uppercase transition-colors duration-500 group-hover:text-red">
                  {next.title}
                </h2>
                <p className="mt-5 font-mono text-[0.6875rem] tracking-[0.2em] text-smoke uppercase">
                  {next.category}
                </p>
              </div>

              <div className="relative hidden aspect-4/3 w-72 shrink-0 overflow-hidden border border-line bg-carbon lg:block">
                <ProjectVisual project={next} />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-void/45 transition-opacity duration-500 group-hover:opacity-0"
                />
              </div>

              <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-line text-chalk transition-colors duration-400 group-hover:border-red group-hover:bg-red lg:hidden xl:flex">
                <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-5" />
              </span>
            </div>
          </Link>
        </section>
      )}
    </PageTransition>
  )
}

function MetaBlock({ label, items }) {
  if (!items?.length) return null
  return (
    <Reveal>
      <h2 className="label text-smoke">{label}</h2>
      <ul className="mt-4 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-ash">
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
