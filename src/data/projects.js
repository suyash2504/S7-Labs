/**
 * ---------------------------------------------------------------------------
 * PORTFOLIO DATA
 * ---------------------------------------------------------------------------
 * Adding a project = adding one object to `projects`. Routes, listings, the
 * home-page reel and the case-study page all derive from this file.
 *
 * Required : slug, title, category, year, visual
 * Optional : caseStudy (omit `caseStudy.ready` and a clean placeholder renders
 *            instead of invented results)
 *
 * `status`  'live'     → shown everywhere, links to its case study
 *           'upcoming' → shown as a locked/next-up slot, no link
 *
 * `visual`  key consumed by <ProjectVisual />. Each key maps to a bespoke
 *           generative composition — see components/ui/ProjectVisual.jsx.
 *           Add `cover: '/work/<slug>/cover.webp'` to any project and the
 *           visual is replaced by that image automatically.
 * ---------------------------------------------------------------------------
 */

export const projects = [
  {
    slug: 'apex-gym',
    number: '01',
    title: 'Apex Gym',
    subtitle: 'Apex Performance Lab',
    category: 'Fitness / Web Design / Development',
    disciplines: ['Web Design', 'Development', '3D / WebGL', 'Art Direction'],
    year: '2026',
    status: 'live',
    summary:
      'A private strength facility that needed a website with the same weight as its equipment. We built a dark, engineered experience with a real-time 3D machine at its centre.',
    // Real captures of the live build (see scripts/capture-project.mjs).
    // `cover` takes precedence over `visual` in <ProjectVisual />.
    cover: '/work/apex-gym/cover.jpg',
    visual: { key: 'apex', accent: '#E50914', accent2: '#FF3B45' },
    caseStudy: {
      ready: true,
      intro:
        'Apex is a precision-equipment strength facility. Most gym websites lead with stock photography of people mid-rep; Apex wanted the opposite — a site that treats the hardware and the programming as the product, and reads more like a technical brand than a fitness chain.',
      sections: [
        {
          label: 'The Approach',
          body: 'We anchored the identity in the machine itself. Rather than photography, the hero renders an interactive 3D gym machine you can orbit, with parts that label themselves as you explore. Everything else — typography, layout, motion — was built to stay out of its way: heavy condensed display type, monospace metadata, near-black surfaces and a single accent.',
        },
        {
          label: 'The Build',
          body: 'React and Vite on TypeScript, with the 3D scene running on React Three Fiber. A scroll-driven camera rig moves through the machine as the page advances, GSAP handles section choreography, and Lenis smooths the scroll without hijacking it. Devices without WebGL get a designed static fallback rather than a blank frame, and the whole motion layer collapses gracefully under prefers-reduced-motion.',
        },
        {
          label: 'The Detail',
          body: 'Equipment is documented like specification sheets — stack load, adjustment range, frame construction — because that is what the audience actually compares. Programs, membership tiers and the facility gallery follow the same restrained system, so the site scales as the facility adds equipment.',
        },
      ],
      gallery: [
        {
          src: '/work/apex-gym/shot-02.jpg',
          alt: 'Apex Gym — the hero machine exploded into labelled components: frame, cable, weight stack, handle and seat.',
          caption:
            'Scrolling pulls the machine apart. Each component labels itself as it separates, so the hardware explains its own construction.',
        },
        {
          src: '/work/apex-gym/shot-03.jpg',
          alt: 'Apex Gym — the equipment section, with specification cards and a technical drawing of the cable crossover.',
          caption:
            'Equipment is documented like a spec sheet — stack load, adjustment range, frame construction — with a line drawing standing in for photography.',
        },
      ],
      deliverables: [
        'Art Direction',
        'UI Design',
        'Interactive 3D Scene',
        'Motion Design',
        'Front-End Development',
        'Responsive Build',
      ],
      stack: ['React', 'Vite', 'TypeScript', 'Three.js / R3F', 'GSAP', 'Lenis', 'Zustand'],
      facts: [
        { label: 'Scope', value: 'Full site design + build' },
        { label: 'Sections', value: '10' },
        { label: 'Hero', value: 'Real-time WebGL' },
        { label: 'Year', value: '2026' },
      ],
      link: null,
    },
  },
  {
    slug: 'joystick-junction',
    number: '02',
    title: 'Joystick Junction',
    subtitle: 'Gaming Arcade & Community',
    category: 'Gaming / Web Design / Development',
    disciplines: ['Web Design', 'Development', 'Branding'],
    year: '2026',
    status: 'live',
    summary:
      'A gaming destination brand built around arcade energy — high contrast, heavy grid, and an interface that feels like a machine you want to walk up to.',
    visual: { key: 'arcade', accent: '#E50914', accent2: '#FF3B45' },
    caseStudy: {
      // Full write-up not published yet — the page renders a clean
      // placeholder instead of fabricated outcomes. Flip to `true` once
      // the sections below are filled in.
      ready: false,
      intro:
        'Joystick Junction is a gaming destination brand. The design work leans into arcade language — hard grids, high contrast, deliberate pixel structure — without tipping into nostalgia pastiche.',
      deliverables: ['Web Design', 'Front-End Development', 'Brand Direction'],
      stack: ['React', 'Vite', 'Tailwind CSS'],
      link: null,
    },
  },

  /* ----- Next up. Flip `status` to 'live' and add a caseStudy to publish. --- */
  {
    slug: 'luxury-restaurant',
    number: '03',
    title: 'Luxury Restaurant',
    category: 'Hospitality / Web Design',
    year: '2026',
    status: 'upcoming',
    visual: { key: 'placeholder', accent: '#8B0000' },
  },
  {
    slug: 'real-estate',
    number: '04',
    title: 'Real Estate',
    category: 'Property / Web Design / Development',
    year: '2026',
    status: 'upcoming',
    visual: { key: 'placeholder', accent: '#8B0000' },
  },
  {
    slug: 'automotive',
    number: '05',
    title: 'Automotive',
    category: 'Automotive / Digital Experience',
    year: '2026',
    status: 'upcoming',
    visual: { key: 'placeholder', accent: '#8B0000' },
  },
  {
    slug: 'premium-hotel',
    number: '06',
    title: 'Premium Hotel',
    category: 'Hospitality / Branding / Web',
    year: '2026',
    status: 'upcoming',
    visual: { key: 'placeholder', accent: '#8B0000' },
  },
]

export const liveProjects = projects.filter((p) => p.status === 'live')
export const upcomingProjects = projects.filter((p) => p.status === 'upcoming')

export const getProject = (slug) => projects.find((p) => p.slug === slug)

/** Next live project after `slug`, wrapping around — powers "Next Project". */
export const getNextProject = (slug) => {
  const i = liveProjects.findIndex((p) => p.slug === slug)
  if (i === -1) return liveProjects[0]
  return liveProjects[(i + 1) % liveProjects.length]
}
