import { PageTransition } from '@/components/layout/PageTransition'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProjectCard } from '@/components/work/ProjectCard'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Reveal, LineRule } from '@/components/ui/Reveal'
import { liveProjects, upcomingProjects } from '@/data/projects'
import { useSeo } from '@/lib/useSeo'

export default function Work() {
  useSeo({ path: '/work' })

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Selected Work"
        index="01"
        title={['Work']}
        lede="A few things we've designed and built. More is on the way."
        meta={[
          { label: 'Live', value: String(liveProjects.length).padStart(2, '0') },
          { label: 'In progress', value: String(upcomingProjects.length).padStart(2, '0') },
        ]}
      />

      <section className="pb-28 sm:pb-36">
        <div className="shell flex flex-col gap-24 sm:gap-32 lg:gap-40">
          {liveProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} flip={i % 2 === 1} priority={i === 0} />
          ))}
        </div>

        <div className="shell mt-28 sm:mt-40">
          <LineRule />
          <Reveal className="mt-8">
            <h2 className="label text-ash">Next up</h2>
            <p className="mt-4 max-w-lg text-base text-smoke">
              Projects currently in design or development. Case studies get published as they
              launch.
            </p>
          </Reveal>

          <div className="mt-16 flex flex-col gap-20 sm:mt-20 sm:gap-24">
            {upcomingProjects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </PageTransition>
  )
}
