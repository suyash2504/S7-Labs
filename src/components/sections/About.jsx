import { Section } from '@/components/ui/SectionHeading'
import { Reveal, RevealLines, LineRule } from '@/components/ui/Reveal'
import { Eyebrow, SectionIndex } from '@/components/ui/Eyebrow'
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
            <Reveal className="flex items-center gap-5">
              <SectionIndex>(06)</SectionIndex>
              <Eyebrow marker={false}>About</Eyebrow>
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
              <p className="mt-7 max-w-xl text-base leading-relaxed text-smoke">
                We work as a small, senior team — which means the people who plan your project
                are the people who design and build it.
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
