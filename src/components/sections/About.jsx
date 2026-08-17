import { Section } from '@/components/ui/SectionHeading'
import { Reveal, RevealLines, LineRule } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Eyebrow'
import { TextLink } from '@/components/ui/Button'
import { site, capabilities } from '@/data/site'

/** Short, honest introduction. No invented history, no invented team. */
export function About() {
  return (
    <Section id="about">
      <div className="shell">
        <LineRule className="mb-8 sm:mb-10" />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionMark index="06">About</SectionMark>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 hidden lg:block">
              <dl className="space-y-6">
                <div>
                  <dt className="label text-smoke">Studio</dt>
                  <dd className="mt-2 text-sm text-ash">{site.name}</dd>
                </div>
                <div>
                  <dt className="label text-smoke">Based in</dt>
                  <dd className="mt-2 text-sm text-ash">{site.location}</dd>
                </div>
                <div>
                  <dt className="label text-smoke">Disciplines</dt>
                  <dd className="mt-2 space-y-1.5 text-sm text-ash">
                    {capabilities.map((c) => (
                      <span key={c} className="block">
                        {c}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <RevealLines
              as="h2"
              lines={['We build ', 'with purpose.']}
              className="font-display text-d1 text-chalk uppercase"
            />

            <Reveal delay={0.18}>
              <p className="mt-10 max-w-2xl text-[clamp(1.125rem,2vw,1.5rem)] leading-[1.5] text-ash">
                S7 Labs combines design, technology and strategy to help businesses create a
                stronger digital presence.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              {/* Solo studio. Stated plainly rather than dressed up as a
                  "small team" — the direct-access angle is the actual pitch. */}
              <p className="mt-7 max-w-xl text-base leading-relaxed text-smoke">
                S7 Labs is a one-person studio. The person you brief is the person who designs,
                builds and ships it — no handoffs, nothing lost in between.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-8">
              <TextLink to="/contact">Start a conversation</TextLink>
              <TextLink href={`mailto:${site.email}`} icon="none">
                {site.email}
              </TextLink>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}
