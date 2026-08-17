import { Section } from '@/components/ui/SectionHeading'
import { Reveal, LineRule } from '@/components/ui/Reveal'
import { Eyebrow, SectionIndex } from '@/components/ui/Eyebrow'
import { ScrollWords } from '@/components/ui/ScrollWords'
import { capabilities } from '@/data/site'

/**
 * The statement section. Deliberately mostly empty — the negative space is
 * doing as much work as the type.
 */
export function Intro() {
  return (
    // See Process.jsx — `overflow-hidden` here would pin ScrollWords' progress.
    <Section id="intro" className="overflow-x-clip">
      <div className="shell">
        <LineRule className="mb-10 sm:mb-14" />

        <Reveal className="flex items-center gap-5">
          <SectionIndex>(01)</SectionIndex>
          <Eyebrow marker={false}>Introduction</Eyebrow>
        </Reveal>

        <h2 className="mt-12 max-w-[18ch] font-display text-d1 uppercase sm:mt-20">
          <ScrollWords
            text="We don't just build websites."
            accent={['websites']}
            offset={['start 0.92', 'end 0.62']}
          />
        </h2>

        <div className="mt-16 grid gap-10 sm:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4 lg:col-start-1">
            <Reveal>
              <span aria-hidden="true" className="block h-16 w-px bg-linear-to-b from-red to-transparent" />
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 lg:flex-col lg:gap-y-3">
                {capabilities.map((c) => (
                  <li key={c} className="label text-smoke">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-[clamp(1.25rem,2.6vw,2rem)] leading-[1.35] font-normal tracking-[-0.015em] text-ash">
              <ScrollWords
                text="We build digital experiences designed to make businesses look better, work smarter and grow faster."
                accent={['better,', 'smarter', 'faster.']}
                offset={['start 0.95', 'end 0.7']}
              />
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
