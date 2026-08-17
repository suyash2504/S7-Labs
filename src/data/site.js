/**
 * Global site configuration.
 * Nav, contact details and social handles all live here — nothing is
 * hard-coded into a component.
 */

export const site = {
  name: 'S7 Labs',
  tagline: 'Think. Build. Evolve.',
  positioning:
    'A digital studio creating websites, brands and digital experiences for ambitious businesses.',
  location: 'Raipur, India',
  // Swap for a branded address (hello@yourdomain.com) once the domain and
  // mailbox exist — this one line feeds every email link on the site.
  email: 'suyash.namdeo07@gmail.com',

  /**
   * Public origin, e.g. 'https://s7labs.in' — no trailing slash.
   * Set VITE_SITE_URL in .env once the real domain is known.
   *
   * Empty on purpose until then: canonical, og:url, og:image and the sitemap
   * all need an absolute URL, and pointing those at a domain nobody owns is
   * worse than omitting them. Everything that depends on this degrades
   * quietly instead.
   */
  url: import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') || '',
  // Used by every WhatsApp CTA on the site. Set `number` once, in full
  // international format without symbols, e.g. '919876543210'.
  //
  // Left null deliberately: while it is null, every WhatsApp button and link
  // hides itself rather than opening a dead chat. Fill it in and they all
  // reappear — no other file needs touching.
  whatsapp: {
    // 91 = India country code + the 10-digit mobile. wa.me rejects a bare
    // local number, so the country code is not optional here.
    number: '918871693737',
    message: "Hi S7 Labs — I'd like to talk about a project.",
  },
  founded: 2026,
}

export const hasWhatsApp = Boolean(site.whatsapp.number)

export const whatsappUrl = () =>
  hasWhatsApp
    ? `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(site.whatsapp.message)}`
    : null

/** Primary navigation. `hash` entries resolve against the home route. */
export const navLinks = [
  { label: 'Work', to: '/work' },
  { label: 'Services', to: '/#services', hash: 'services' },
  { label: 'About', to: '/#about', hash: 'about' },
  { label: 'Pricing', to: '/#pricing', hash: 'pricing' },
]

export const footerLinks = [...navLinks, { label: 'Contact', to: '/contact' }]

/**
 * Social profiles. Set `href` to null to hide a channel until it exists —
 * nothing renders for a null href.
 */
export const socials = [
  { label: 'Instagram', short: 'IG', href: null },
  { label: 'LinkedIn', short: 'IN', href: null },
  { label: 'Dribbble', short: 'DR', href: null },
  { label: 'GitHub', short: 'GH', href: null },
]

export const capabilities = [
  'Web Design',
  'Web Development',
  'UI/UX Design',
  'E-Commerce',
  'Branding',
  'Logo Design',
  'Website Maintenance',
]

/** Marquee content for the ticker under the hero. */
export const tickerItems = [
  'WEB DESIGN',
  'DEVELOPMENT',
  'BRANDING',
  'UI/UX',
  'E-COMMERCE',
  'DIGITAL EXPERIENCES',
]
