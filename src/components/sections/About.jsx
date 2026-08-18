import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/ui/SectionHeading'
import { Reveal, RevealLines, LineRule } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Eyebrow'
import { site, capabilities } from '@/data/site'
import { useCopy } from '@/lib/hooks'

/** Short, honest introduction. No invented history, no invented team. */
export function About() {
  const [copyState, copy] = useCopy()

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

            {/* Stacked rules rather than inline text links: these read as
                actions and echo the rhythm of the services rows and the
                pipeline list, so nothing new is introduced. */}
            <Reveal delay={0.3} className="mt-10 max-w-md">
              <ul className="border-t border-line">
                <li className="border-b border-line">
                  <Link
                    to="/contact"
                    className="group flex items-center justify-between py-3.5 transition-[padding-left] duration-400 ease-[var(--ease-out-expo)] hover:pl-2"
                  >
                    <span className="text-sm text-chalk">Start a conversation</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-4 text-smoke transition-[color,transform] duration-400 ease-[var(--ease-out-expo)] group-hover:-translate-x-0.5 group-hover:text-red-bright"
                    />
                  </Link>
                </li>
                <li className="flex items-center justify-between border-b border-line">
                  <a
                    href={`mailto:${site.email}`}
                    className="group flex-1 py-3.5 transition-[padding-left] duration-400 ease-[var(--ease-out-expo)] hover:pl-2"
                  >
                    <span className="text-sm text-chalk">{site.email}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(site.email)}
                    className="shrink-0 cursor-pointer py-3.5 pl-4 text-[0.6875rem] font-medium tracking-[0.16em] text-smoke uppercase transition-colors hover:text-red-bright"
                    aria-label="Copy email address"
                  >
                    {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Failed' : 'Copy'}
                  </button>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}
