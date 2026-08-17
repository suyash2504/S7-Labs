import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

/** The S7 mark — an angular 7 with a red block cut out of its base. */
export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" role="presentation">
      <path d="M7 6h18v4.6L17.4 26h-5.6l7.6-15.4H7z" fill="currentColor" />
      <rect x="7" y="21" width="4.6" height="4.6" className="fill-red" />
    </svg>
  )
}

/** Wordmark + mark, linked home. */
export function Logo({ className, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="S7 Labs — home"
      className={cn('group inline-flex items-center gap-2.5 text-chalk', className)}
    >
      <LogoMark className="size-5 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-px sm:size-[22px]" />
      <span className="font-display text-[0.9375rem] leading-none font-bold tracking-[0.16em] sm:text-base">
        S7 LABS
      </span>
    </Link>
  )
}
