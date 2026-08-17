import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { Logo } from './Logo'
import { navLinks, site, socials, whatsappUrl, hasWhatsApp } from '@/data/site'
import { EASE } from '@/lib/motion'
import { useScrollLock } from '@/lib/hooks'

const panel = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  show: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.6, ease: EASE, staggerChildren: 0.06, delayChildren: 0.18 },
  },
  exit: { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.4, ease: [0.83, 0, 0.17, 1] } },
}

const item = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.7, ease: EASE } },
  exit: { y: '110%', transition: { duration: 0.25 } },
}

/** Fullscreen overlay menu. Locks scroll, closes on Escape, restores focus. */
export function MobileMenu({ open, onClose }) {
  const closeRef = useRef(null)
  const openerRef = useRef(null)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    openerRef.current = document.activeElement
    const t = setTimeout(() => closeRef.current?.focus(), 80)

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          id="s7-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          variants={panel}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[70] flex flex-col bg-void lg:hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid opacity-30"
            style={{
              maskImage: 'radial-gradient(80% 60% at 50% 30%, #000, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(80% 60% at 50% 30%, #000, transparent 85%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 100%, rgba(229,9,20,0.16) 0%, rgba(8,8,8,0) 70%)',
            }}
          />

          <div className="shell relative flex h-20 shrink-0 items-center justify-between">
            <Logo onClick={onClose} />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="-mr-2 flex size-11 cursor-pointer items-center justify-center text-chalk transition-colors hover:text-red"
            >
              <X strokeWidth={1.5} className="size-6" />
            </button>
          </div>

          <nav className="shell relative flex flex-1 flex-col justify-center" aria-label="Main">
            <ul>
              {[...navLinks, { label: 'Contact', to: '/contact' }].map((link, i) => (
                <li key={link.label} className="overflow-hidden border-b border-line last:border-b-0">
                  <motion.div variants={item}>
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="group flex items-baseline gap-4 py-5 sm:py-6"
                    >
                      <span className="font-mono text-[0.625rem] tracking-[0.2em] text-smoke">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-[clamp(2.25rem,11vw,4rem)] leading-none font-bold tracking-[-0.035em] text-chalk uppercase transition-colors group-hover:text-red">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            variants={item}
            className="shell relative shrink-0 border-t border-line py-7 pb-[max(1.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-ash transition-colors hover:text-chalk"
              >
                {site.email}
              </a>
              {hasWhatsApp && (
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label border border-line px-4 py-2.5 text-ash transition-colors hover:border-red/60 hover:text-chalk"
                >
                  WhatsApp Us
                </a>
              )}
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="label text-smoke">{site.location}</span>
              <ul className="flex gap-4">
                {socials
                  .filter((s) => s.href)
                  .map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label text-smoke transition-colors hover:text-red-bright"
                      >
                        {s.short}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
