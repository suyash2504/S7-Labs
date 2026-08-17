import { Reveal, RevealLines } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'

/**
 * Shared masthead for inner pages. Keeps the top of /work, /work/:slug and
 * /contact rhythmically identical to the home page sections.
 */
export function PageHeader({ eyebrow, index, title, lede, meta, className, children }) {
  return (
    <header
      className={cn(
        'relative overflow-hidden border-b border-line pt-36 pb-16 sm:pt-44 sm:pb-20 lg:pt-52 lg:pb-24',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-30"
        style={{
          maskImage: 'radial-gradient(70% 80% at 30% 0%, #000, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(70% 80% at 30% 0%, #000, transparent 78%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(38% 60% at 82% 8%, rgba(229,9,20,0.13) 0%, rgba(8,8,8,0) 68%)',
        }}
      />

      <div className="shell relative">
        <Reveal>
          <SectionMark index={index}>{eyebrow}</SectionMark>
        </Reveal>

        <RevealLines
          as="h1"
          delay={0.06}
          lines={title}
          className="mt-8 font-display text-d1 text-chalk uppercase sm:mt-10"
        />

        <div className="mt-10 flex flex-col gap-8 sm:mt-12 lg:flex-row lg:items-end lg:justify-between">
          {lede && (
            <Reveal delay={0.16}>
              <p className="max-w-xl text-lead text-ash">{lede}</p>
            </Reveal>
          )}

          {meta && (
            <Reveal delay={0.22}>
              <dl className="flex gap-10">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="label text-smoke">{m.label}</dt>
                    <dd className="mt-2 font-display text-2xl font-bold tracking-tight text-chalk">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>

        {children}
      </div>
    </header>
  )
}
