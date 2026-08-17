import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui/Button'
import { navLinks } from '@/data/site'
import { useActiveSection, useScrolledPast } from '@/lib/hooks'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/cn'

const SECTION_IDS = navLinks.filter((l) => l.hash).map((l) => l.hash)

/**
 * Sticky navbar. Transparent at the top of the page, then settles into a
 * translucent blurred bar with a hairline. Tracks the section in view on the
 * home page so the active link stays honest.
 */
export function Navbar() {
  const scrolled = useScrolledPast(28)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const activeSection = useActiveSection(SECTION_IDS)

  const onHome = pathname === '/'

  // Any navigation closes the menu.
  useEffect(() => setMenuOpen(false), [pathname, hash])

  const isActive = (link) => {
    if (link.hash) return onHome && activeSection === link.hash
    return pathname === link.to || pathname.startsWith(`${link.to}/`)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:bg-chalk focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void"
      >
        Skip to content
      </a>

      <motion.header
        className={cn(
          'fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled
            ? 'border-b border-line bg-void/72 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent',
        )}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
      >
        <div
          className={cn(
            'shell flex items-center justify-between transition-[height] duration-500 ease-[var(--ease-out-expo)]',
            scrolled ? 'h-16 sm:h-[4.5rem]' : 'h-20 sm:h-24',
          )}
        >
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <NavItem link={link} active={isActive(link)} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <Button to="/contact" variant="secondary" size="sm" icon="up" magnetic={false}>
                Start a Project
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="s7-mobile-menu"
              className="group -mr-2 flex size-11 cursor-pointer items-center justify-center lg:hidden"
            >
              <span className="flex flex-col items-end gap-[5px]">
                <span className="block h-px w-6 bg-chalk transition-all duration-400 ease-[var(--ease-out-expo)]" />
                <span className="block h-px w-4 bg-chalk transition-all duration-400 ease-[var(--ease-out-expo)] group-hover:w-6" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

function NavItem({ link, active }) {
  return (
    <Link
      to={link.to}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative block px-4 py-2 text-sm font-medium transition-colors duration-300',
        active ? 'text-chalk' : 'text-ash hover:text-chalk',
      )}
    >
      {link.label}
      <span
        aria-hidden="true"
        className={cn(
          'absolute bottom-1 left-4 h-px bg-red transition-all duration-500 ease-[var(--ease-out-expo)]',
          active ? 'w-[calc(100%-2rem)]' : 'w-0 group-hover:w-[calc(100%-2rem)]',
        )}
      />
    </Link>
  )
}
