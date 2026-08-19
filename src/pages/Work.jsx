import { PageTransition } from '@/components/layout/PageTransition'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProjectIndex } from '@/components/work/ProjectIndex'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { projects, liveProjects, upcomingProjects } from '@/data/projects'
import { useSeo } from '@/lib/useSeo'

/**
 * The archive. One row per project rather than one screen per project — see
 * ProjectIndex for why. Live and upcoming share the list instead of sitting in
 * two separate stacks: the pipeline reads as part of the body of work when it
 * is interleaved by number, and as an apology when it is quarantined below a
 * rule.
 *
 * The lede carries no "hover to preview" hint on purpose — the preview is
 * desktop-only, and a touch visitor reading an instruction they cannot follow
 * is worse off than one who never knew it existed.
 */
export default function Work() {
  useSeo({ path: '/work' })

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Selected Work"
        backTo="/"
        backLabel="Home"
        title={['Work']}
        lede="A few things we've designed and built. More is on the way."
        meta={[
          { label: 'Live', value: String(liveProjects.length).padStart(2, '0') },
          { label: 'In progress', value: String(upcomingProjects.length).padStart(2, '0') },
        ]}
      />

      <section className="pb-28 sm:pb-36">
        <div className="shell">
          <ProjectIndex projects={projects} />

          <p className="mt-10 max-w-lg text-sm text-smoke">
            Dimmed rows are in design or development. Case studies get published as they
            launch.
          </p>
        </div>
      </section>

      <FinalCTA />
    </PageTransition>
  )
}
