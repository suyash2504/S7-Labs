import { cn } from '@/lib/cn'
import { Eyebrow, SectionIndex } from './Eyebrow'
import { Reveal, RevealLines, LineRule } from './Reveal'

/**
 * Consistent section header: rule → index + eyebrow → oversized title → lede.
 * Used by every major section so the vertical rhythm never drifts.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lines,
  lede,
  align = 'left',
  className,
  titleClassName,
  children,
}) {
  return (
    <header className={cn('relative', className)}>
      <LineRule className="mb-8 sm:mb-10" />

      <div
        className={cn(
          'flex flex-col gap-6 sm:flex-row sm:items-baseline sm:justify-between',
          align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        )}
      >
        <Reveal className="flex items-center gap-5">
          {index && <SectionIndex>{index}</SectionIndex>}
          {eyebrow && <Eyebrow marker={!index}>{eyebrow}</Eyebrow>}
        </Reveal>
        {children}
      </div>

      <RevealLines
        as="h2"
        delay={0.05}
        lines={lines ?? [title]}
        className={cn(
          'mt-7 font-display text-d1 text-chalk uppercase sm:mt-9',
          align === 'center' && 'text-center',
          titleClassName,
        )}
      />

      {lede && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              'mt-7 max-w-xl text-lead text-ash',
              align === 'center' && 'mx-auto text-center',
            )}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </header>
  )
}

/** Standard section shell — handles the vertical rhythm and anchor offset. */
export function Section({ id, className, children, tone = 'void', ...rest }) {
  return (
    <section
      id={id}
      // Anchor offset comes from `html { scroll-padding-top }` in index.css —
      // adding scroll-margin here too would double it.
      className={cn(
        'relative py-24 sm:py-32 lg:py-40',
        tone === 'carbon' && 'bg-carbon',
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  )
}
