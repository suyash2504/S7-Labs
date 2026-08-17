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
  email: 'hello@s7labs.in',
  // Update once — used by every WhatsApp CTA on the site.
  whatsapp: {
    number: '910000000000',
    message: "Hi S7 Labs — I'd like to talk about a project.",
  },
  founded: 2026,
}

export const whatsappUrl = () =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(site.whatsapp.message)}`

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
