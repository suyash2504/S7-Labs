import { Section, SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { principles } from '@/data/principles'

/** WHY S7 LABS — four statements, staggered editorial columns. */
export function WhyS7() {
  return (
    <Section id="why" tone="carbon">
      <div className="shell">
        <SectionHeading
          index="(05)"
          eyebrow="Principles"
          title="Why S7 Labs"
          lede="Four things that decide how every project here gets made."
        />

        <div className="mt-16 grid gap-x-14 gap-y-14 sm:mt-24 lg:grid-cols-2 lg:gap-y-4">
          {principles.map((p, i) => (
            <Reveal
              key={p.id}
              delay={(i % 2) * 0.08}
              // Offset the right column so the pairs never read as a table.
              className={i % 2 === 1 ? 'lg:mt-28' : 'lg:mt-0'}
            >
              <div className="group border-t border-line pt-8 transition-colors duration-500 hover:border-red/50 sm:pt-10">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-smoke">
                    {p.index}
                  </span>
                  <span className="label text-red-bright">{p.title}</span>
                </div>

                <h3 className="mt-6 max-w-[16ch] font-display text-d3 text-chalk sm:mt-8">
                  {p.statement}
                </h3>

                <p className="mt-5 max-w-md text-base leading-relaxed text-ash">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
