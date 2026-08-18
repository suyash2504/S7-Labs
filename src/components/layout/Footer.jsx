import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { LogoMark } from './Logo'
import { Reveal } from '@/components/ui/Reveal'
import {
  footerLinks,
  site,
  socials,
  capabilities,
  whatsappUrl,
  whatsappDisplay,
  hasWhatsApp,
} from '@/data/site'

/* Deliberately a step below the column headings (11px / 0.24em) so the two
   don't compete. 10px smoke is 4.7:1 on carbon — passes AA for body text. */
const microLabel = 'text-[0.625rem] font-medium tracking-[0.18em] text-smoke uppercase'

export function Footer() {
  const toTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })

  return (
    <footer className="relative border-t border-line bg-carbon pt-20 sm:pt-24">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Identity */}
          <div className="lg:col-span-4">
            <Reveal>
              <Link to="/" aria-label="S7 Labs — home" className="inline-flex items-center gap-3">
                <LogoMark className="size-6 text-chalk" />
                <span className="font-display text-lg font-bold tracking-[0.16em] text-chalk">
                  S7 LABS
                </span>
              </Link>
              <p className="mt-6 font-display text-d3 tracking-tight text-chalk">
                Think. Build. <span className="text-red">Evolve.</span>
              </p>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-ash">
                {site.positioning}
              </p>
            </Reveal>
          </div>

          {/* Navigate */}
          <nav className="lg:col-span-2 lg:col-start-6" aria-label="Footer">
            <Reveal>
              <h2 className="text-[0.6875rem] font-bold tracking-[0.24em] text-chalk uppercase">Navigate</h2>
              <ul className="mt-6 space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-2 text-sm text-ash transition-colors hover:text-chalk"
                    >
                      <span
                        aria-hidden="true"
                        className="h-px w-0 bg-red transition-all duration-400 ease-[var(--ease-out-expo)] group-hover:w-3"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </nav>

          {/* Services */}
          <div className="lg:col-span-2">
            <Reveal delay={0.06}>
              <h2 className="text-[0.6875rem] font-bold tracking-[0.24em] text-chalk uppercase">Services</h2>
              <ul className="mt-6 space-y-3">
                {capabilities.map((c) => (
                  <li key={c} className="text-sm text-ash">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Connect */}
          <div className="lg:col-span-3">
            <Reveal delay={0.12}>
              <h2 className="text-[0.6875rem] font-bold tracking-[0.24em] text-chalk uppercase">Connect</h2>
              {/* A description list, not a link list: two of these three rows
                  are addresses and one is a place. Labelling each row is what
                  separates them — without it the location reads as a link. */}
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className={microLabel}>Email</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${site.email}`}
                      className="text-sm break-words text-chalk transition-colors hover:text-red-bright"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                {hasWhatsApp && (
                  <div>
                    <dt className={microLabel}>WhatsApp</dt>
                    <dd className="mt-1.5">
                      <a
                        href={whatsappUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-chalk transition-colors hover:text-red-bright"
                      >
                        {whatsappDisplay()}
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className={microLabel}>Studio</dt>
                  <dd className="mt-1.5 text-sm text-chalk">{site.location}</dd>
                </div>
              </dl>

              {socials.some((s) => s.href) && (
                <ul className="mt-8 flex gap-3">
                  {socials
                    .filter((s) => s.href)
                    .map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="flex size-10 items-center justify-center border border-line text-xs font-medium tracking-wider text-smoke transition-colors hover:border-red/60 hover:text-chalk"
                        >
                          {s.short}
                        </a>
                      </li>
                    ))}
                </ul>
              )}
            </Reveal>
          </div>
        </div>

        {/* Oversized wordmark */}
        {/* Pure decoration — a watermark, not content. The wordmark already
            appears legibly at the top of this footer, so this is exempt under
            WCAG 1.4.3 (incidental text).
            Note: axe/Lighthouse will still report this as a contrast failure.
            That rule ignores aria-hidden by design, because the text remains
            visually present. Passing 3:1 here needs ~35% white, which turns a
            watermark into a headline — so this one is knowingly left as-is. */}
        <div className="mt-20 overflow-hidden sm:mt-28">
          <p
            aria-hidden="true"
            className="w-full text-center font-display text-[clamp(3.5rem,17.5vw,15rem)] leading-[0.8] font-bold tracking-[-0.05em] whitespace-nowrap text-white/[0.055] select-none"
          >
            S7 LABS
          </p>
        </div>

        {/* Baseline. Copyright left, back-to-top right, at every width.
            The location used to sit here too, but it now has a labelled
            `Studio` row in Connect — repeating it 200px later just read as a
            mistake. */}
        <div className="mt-10 border-t border-line py-7">
          <div className="flex items-center justify-between gap-5">
            <p className="text-xs text-smoke">
              © {site.founded} {site.name}. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              {/* The box used to be `border-line` on `bg-carbon` — 1.5:1, which
                  read as no border at all. Now a red outline with a slow halo. */}
              <button
                type="button"
                onClick={toTop}
                className="group flex shrink-0 cursor-pointer items-center gap-2 text-xs font-medium text-chalk"
              >
                <span className="hidden sm:inline">Back to top</span>
                <span className="glow-pulse flex size-10 items-center justify-center border border-red sm:size-8">
                  <ArrowUp
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 sm:size-3.5"
                  />
                </span>
                <span className="sr-only sm:hidden">Back to top</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
