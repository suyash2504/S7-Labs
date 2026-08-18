import { liveProjects } from './projects.js'

/**
 * Every indexable route, with the <head> metadata that belongs to it.
 *
 * This is imported by two very different consumers, which is the whole point:
 *
 *   - `useSeo` reads it at runtime, when the router swaps pages.
 *   - `vite.config.js` reads it at build time, to write a real HTML file per
 *     route and to generate sitemap.xml.
 *
 * Keeping them on one table is what stops the build and the runtime from
 * disagreeing — before this existed, every route shipped the homepage's title
 * and a canonical pointing at `/`, which told Google that /work and /contact
 * were duplicates of the front page.
 *
 * Note the explicit `.js` on the import above: Vite resolves extensionless
 * paths, but this module is also pulled into vite.config.js, so it stays
 * unambiguous for the config loader too.
 */

export const SEO_DEFAULTS = {
  title: 'S7 Labs — Digital Experiences That Move Businesses Forward',
  description:
    'S7 Labs designs and develops premium websites, digital experiences and brand identities for modern businesses.',
}

export const routes = [
  {
    path: '/',
    priority: '1.0',
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
  },
  {
    path: '/work',
    priority: '0.9',
    title: 'Work — S7 Labs',
    description:
      'Selected projects by S7 Labs — websites, digital experiences and brand identities designed and built end to end.',
  },
  // Case studies come from the project data, so a new live project gets a
  // prerendered page and a sitemap entry without anyone editing this file.
  ...liveProjects.map((p) => ({
    path: `/work/${p.slug}`,
    priority: '0.7',
    title: `${p.title} — S7 Labs`,
    description: p.summary,
  })),
  {
    path: '/contact',
    priority: '0.8',
    title: 'Contact — S7 Labs',
    description:
      'Start a project with S7 Labs. Tell us what you are building and we will come back with scope, timeline and a quote.',
  },
]

export const getRoute = (path) => routes.find((r) => r.path === path)
