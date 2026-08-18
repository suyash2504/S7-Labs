import { cn } from '@/lib/cn'

/**
 * Seamless CSS marquee. Renders the row twice and translates -50%, so the
 * loop has no seam and costs one composited transform.
 */
export function Marquee({ items, duration = 46, className, itemClassName, separator }) {
  const row = (aria) => (
    <div className="flex shrink-0 items-center" aria-hidden={aria ? undefined : 'true'}>
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span className={itemClassName}>{item}</span>
          <span className="mx-5 flex items-center sm:mx-8 lg:mx-10" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  )

  return (
    <div className={cn('group relative flex overflow-hidden', className)}>
      <div
        className="flex w-max animate-marquee will-change-transform group-hover:[animation-play-state:paused]"
        style={{ '--marquee-duration': `${duration}s` }}
      >
        {row(true)}
        {row(false)}
      </div>
    </div>
  )
}
