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
    kind: 'concept',
    summary:
      'A self-initiated concept for a precision-equipment gym, built to test whether a real-time 3D machine could carry a fitness site instead of the usual stock photography.',
    // Real captures of the live build (see scripts/capture-project.mjs).
    // `cover` takes precedence over `visual` in <ProjectVisual />.
    cover: '/work/apex-gym/cover.jpg',
    visual: { key: 'apex', accent: '#E50914', accent2: '#FF3B45' },
    caseStudy: {
      ready: true,
      intro:
        'Apex Performance Lab is a concept brand for a precision-equipment strength facility. Most gym sites lead with photography of people mid-rep; this build takes the opposite position — treat the hardware and the programming as the product, and let the site read like a technical brand rather than a fitness chain.',
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
        { label: 'Type', value: 'Self-initiated concept' },
        { label: 'Sections', value: '11' },
        { label: 'Hero', value: 'Real-time WebGL' },
        { label: 'Year', value: '2026' },
      ],
      link: 'https://suyash2504.github.io/Apex-Gym/',
    },
  },
  {
    slug: 'joystick-junction',
    number: '02',
    title: 'Joystick Junction',
    subtitle: "Raipur's Premium Gaming Lounge",
    category: 'Gaming / Web Design / Development',
    disciplines: ['Web Design', 'Development', '3D / WebGL', 'Booking Flow'],
    year: '2026',
    status: 'live',
    kind: 'concept',
    summary:
      'A concept build for a gaming lounge, testing how far a booking flow can go on a static site: pick a rig, a date and a slot, watch the price update, and pay without leaving the page.',
    cover: '/work/joystick-junction/cover.jpg',
    visual: { key: 'arcade', accent: '#E50914', accent2: '#FF3B45' },
    caseStudy: {
      ready: true,
      intro:
        'Joystick Junction is a concept for a premium gaming lounge in Raipur — high-end PCs, PS4 and PS5 pods, and a full motion racing simulator. Most lounges in the category stop at a phone number and an Instagram page. The question this build set out to answer was whether the site could take the booking itself: choose a platform, see the price move, reserve the seat and pay, without a single call.',
      sections: [
        {
          label: 'The Approach',
          body: 'The lounge sells atmosphere as much as hardware, so the site opens with it: a dark hero carrying the wordmark in neon magenta and cyan, orbital rings, and a drifting field of PlayStation glyphs rendered in WebGL. From there the tone tightens deliberately — the further you scroll, the more the page behaves like a utility, because the goal is a completed booking rather than a long visit.',
        },
        {
          label: 'The Booking Flow',
          body: 'The centrepiece is a single-screen reservation form. Platform, player count, date, duration and time slot sit on the left; a summary panel on the right updates live and computes the total as choices change, so the price is never a surprise at the end. Razorpay handles payment with UPI, card, net banking and wallet options inline — the booking is finished on the page it started on.',
        },
        {
          label: 'The Build',
          body: 'Hand-written HTML, CSS and JavaScript with Three.js driving the hero scene — no framework, which keeps the payload small and the page fast on the mid-range phones most of the audience actually books from. Orbitron and Rajdhani carry the arcade voice while Sora keeps the body copy readable, and the whole thing deploys as a static site on GitHub Pages.',
        },
        {
          label: 'The Detail',
          body: 'Four platforms are documented like a menu rather than a spec sheet — RTX-powered rigs at 240Hz, console pods with 4K displays, and a force-feedback racing rig priced by the quarter-hour. Pricing is hourly and stated plainly, with no memberships or tiers, because the decision being made is simply how long to play.',
        },
      ],
      gallery: [
        {
          src: '/work/joystick-junction/shot-02.jpg',
          alt: 'Joystick Junction — the services and hourly pricing sections, with the four gaming platforms laid out.',
          caption:
            'Four platforms, priced by the hour with no memberships. The decision is only ever how long to play.',
        },
        {
          src: '/work/joystick-junction/shot-03.jpg',
          alt: 'Joystick Junction — the slot booking form with a live booking summary and Razorpay payment options.',
          caption:
            'The summary panel recalculates as the platform, duration and player count change, so the total is settled before payment begins.',
        },
      ],
      deliverables: [
        'Art Direction',
        'UI Design',
        'WebGL Hero Scene',
        'Booking Flow Design',
        'Payment Integration',
        'Front-End Development',
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'Razorpay', 'GitHub Pages'],
      facts: [
        { label: 'Type', value: 'Self-initiated concept' },
        { label: 'Sections', value: '10' },
        { label: 'Platforms', value: '4' },
        { label: 'Booking', value: 'Live pricing + pay' },
      ],
      link: 'https://suyashnamdeo07.github.io/JoystickJunction/',
    },
  },

  {
    slug: 'real-estate',
    number: '03',
    title: 'Amara Villas',
    subtitle: 'Thirty-two homes, two garden streets',
    category: 'Property / Web Design / Development',
    disciplines: ['Web Design', 'Development', 'Art Direction', 'Interaction Design'],
    year: '2026',
    status: 'live',
    kind: 'concept',
    summary:
      'A concept for a standalone-villa community in Raipur, built to test whether a property site can carry real inventory — pick a plot, pick a villa, see the elevation, the rooms, the plan and the price — instead of asking for a phone number and mailing a brochure.',
    cover: '/work/real-estate/cover.jpg',
    visual: { key: 'placeholder', accent: '#B07A50' },
    caseStudy: {
      ready: true,
      intro:
        'Amara is a concept brand for thirty-two standalone villas in Telibandha, Raipur — not a tower divided into units, but thirty-two independent homes on their own plots, facing each other across two garden streets. Luxury property sites in the category tend to lead with a rendered sunset and end with a lead-capture box, so the question this build set out to answer was what the site would look like if it did the opposite: photograph every villa honestly, draw the architecture that explains it, publish the availability plot by plot, and let a visitor choose a specific home before anyone speaks to them.',
      sections: [
        {
          label: 'The Approach',
          body: 'The whole site is set in one warm family — lime-washed ivory, terracotta and espresso — with a high-contrast serif carrying the display type and a monospace holding every number. The one exception is the hero: a dusk photograph of a villa arrival, lit from within, which called for a dark espresso scrim rather than the site\'s usual ivory one. Every other section resolves back to ivory the instant the page moves past it.',
        },
        {
          label: 'The Plot Explorer',
          body: 'The centrepiece is the one screen that behaves like a tool rather than a brochure. The community is drawn as two garden streets of sixteen numbered plots, and every plot is a button: select one and its villa\'s front elevation, floor plan, aspect and price load beside it, and that plot is carried down into the viewing form so the enquiry arrives naming a specific home. Allotted plots stay visible and stay disabled, because hiding them would make the street look emptier than it is.',
        },
        {
          label: 'The Build',
          body: 'React and Vite with Tailwind, and a deliberate split between what is photographed and what is drawn. Villa exteriors and every interior room are photographs, because a plan cannot tell you what a room feels like. The masterplan, the four floor plans and the jaali module stay SVG, because a drawing states an intention where a photograph only states a finish. Lenis smooths the scroll, reveals run off IntersectionObserver, and the whole motion layer stands down under prefers-reduced-motion.',
        },
        {
          label: 'The Detail',
          body: 'Every villa card pairs its front elevation with its own floor plan beneath it, then three interior photographs — living, bedroom, bath or kitchen — so the feel of a home and its dimensions are read together rather than on separate pages. Each card opens into a full detail view: the elevation at size, every interior photograph, and the complete room schedule down to the last dimension, rather than making a visitor guess from a summary. The four plans are drawn to a single shared scale, because the only honest way to compare two homes is side by side. Two plots at the head of each street face the shared green on three sides and carry a premium for it, computed rather than written in twice. Every number on the page — availability counts, prices, plot areas in square feet — is derived from one inventory file, so a villa can\'t be sold on one screen and available on another.',
        },
      ],
      gallery: [
        {
          src: '/work/real-estate/shot-02.jpg',
          alt: 'Amara Villas — the four villa types, each showing its front elevation and floor plan above three interior photographs.',
          caption:
            'Each type pairs a front elevation with its own plan, drawn to one shared scale, and three interior photographs — reporting its live availability from the same inventory the explorer reads.',
        },
        {
          src: '/work/real-estate/shot-03.jpg',
          alt: 'Amara Villas — the plot explorer, with two garden streets of numbered plots and a detail panel showing the selected villa.',
          caption:
            'Select a plot on either street and its villa\'s elevation, plan, aspect and price load beside it. The choice follows you into the viewing form.',
        },
      ],
      deliverables: [
        'Art Direction',
        'Photo Editing',
        'UI Design',
        'Interaction Design',
        'Architectural Drawing',
        'Front-End Development',
      ],
      stack: ['React', 'Vite', 'Tailwind CSS', 'SVG', 'Lenis', 'WebP'],
      facts: [
        { label: 'Type', value: 'Self-initiated concept' },
        { label: 'Villas', value: '32, live inventory' },
        { label: 'Location', value: 'Telibandha, Raipur' },
        { label: 'Year', value: '2026' },
      ],
      link: 'https://suyash2504.github.io/Amara-Villas/',
    },
  },

  /* ----- Next up. Flip `status` to 'live' and add a caseStudy to publish. --- */
  {
    slug: 'luxury-restaurant',
    number: '04',
    title: 'Luxury Restaurant',
    category: 'Hospitality / Web Design',
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
