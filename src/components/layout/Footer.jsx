import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { LogoMark } from './Logo'
import { Reveal } from '@/components/ui/Reveal'
import { footerLinks, site, socials, capabilities, whatsappUrl, hasWhatsApp } from '@/data/site'

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
              <h2 className="label text-smoke">Navigate</h2>
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
              <h2 className="label text-smoke">Services</h2>
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
              <h2 className="label text-smoke">Connect</h2>
              <ul className="mt-6 space-y-3">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm text-ash transition-colors hover:text-chalk"
                  >
                    {site.email}
                  </a>
                </li>
                {hasWhatsApp && (
                  <li>
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ash transition-colors hover:text-chalk"
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
                <li className="text-sm text-smoke">{site.location}</li>
              </ul>

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

        {/* Baseline */}
        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-5 border-t border-line py-7 sm:flex-row sm:items-center">
          <p className="text-xs text-smoke">
            © {site.founded} {site.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="label text-smoke">{site.location}</span>
            {/* The box used to be `border-line` on `bg-carbon` — 1.5:1, which
                read as no border at all. Now a red outline with a slow halo. */}
            <button
              type="button"
              onClick={toTop}
              className="group flex cursor-pointer items-center gap-2 text-xs font-medium text-chalk"
            >
              Back to top
              <span className="glow-pulse flex size-8 items-center justify-center border border-red">
                <ArrowUp
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-3.5 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
