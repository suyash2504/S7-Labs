import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Reveal, RevealLines } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'

/**
 * Shared masthead for inner pages. Keeps the top of /work, /work/:slug and
 * /contact rhythmically identical to the home page sections.
 *
 * `index` is the oversized outlined counter. It sequences sections on the home
 * page, where 01/02/03 mean something. On a standalone page there is nothing
 * to sequence, so leave it off — on /work a header reading "01 SELECTED WORK"
 * sat directly above a list whose first row is also "01", and the two numbers
 * read as if they were related.
 *
 * `backTo` renders the same return link the case-study pages use, so every
 * page one level down has a visible way back rather than relying on the
 * browser control.
 */
export function PageHeader({
  eyebrow,
  index,
  title,
  lede,
  meta,
  backTo,
  backLabel = 'Back',
  className,
  children,
}) {
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
        {backTo && (
          <Reveal className="mb-9 sm:mb-11">
            <Link
              to={backTo}
              className="group inline-flex items-center gap-2.5 text-sm text-ash transition-colors hover:text-chalk"
            >
              <ArrowLeft
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-4 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:-translate-x-1"
              />
              {backLabel}
            </Link>
          </Reveal>
        )}

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
