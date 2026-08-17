# S7 Labs

**Think. Build. Evolve.**

Marketing site for S7 Labs — a digital studio in Raipur, India.

React 19 · Vite 8 · Tailwind CSS 4 · Framer Motion 13 · React Router 7

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

Dev server runs on `http://localhost:5173`.

---

## Structure

```
src/
  data/              ← all content lives here, nothing hard-coded in components
    site.js            nav, contact, socials, ticker
    services.js        the five service rows
    projects.js        portfolio + case studies
    process.js         Think → Build → Evolve
    principles.js      Why S7 Labs
    pricing.js         tiers + budget bands
  lib/
    motion.js          shared variants & easing
    hooks.js           pointer, media query, scroll, section tracking
    useMagnetic.js     magnetic-pull behaviour
    useSeo.js          per-route title/meta/OG
    enquiry.js         form submission seam + validation
  components/
    layout/            Navbar, MobileMenu, Footer, cursor, scroll, transitions
    ui/                Button, Reveal, SectionHeading, Marquee, glyphs
    hero/              HeroVisual + HeroSculpture (the canvas piece)
    sections/          one file per home-page section
    work/              ProjectCard
    contact/           EnquiryForm, Field
  pages/             Home, Work, CaseStudy, Contact, NotFound
```

Design tokens (colour, type scale, easing, gutters) are defined once in
`src/index.css` under `@theme`. Change a value there and it propagates
everywhere.

---

## Adding a project

Add one object to `projects` in `src/data/projects.js`. Routes, the home reel,
`/work` and the case-study page all derive from it.

```js
{
  slug: 'new-client',
  number: '03',
  title: 'New Client',
  category: 'Sector / Web Design / Development',
  year: '2026',
  status: 'live',              // 'upcoming' renders a locked slot with no link
  kind: 'concept',             // optional — badges the card as self-initiated
  summary: '…',
  visual: { key: 'placeholder' },
  cover: '/work/new-client/cover.webp',   // optional — replaces the generated art
  caseStudy: {
    ready: true,               // false → clean "in progress" placeholder
    intro: '…',
    sections: [{ label: 'The Approach', body: '…' }],
    deliverables: [], stack: [], facts: [],
  },
}
```

Covers are optional. Without one, `ProjectVisual` draws a bespoke SVG
composition (`apex`, `arcade`, `placeholder` — add new keys in
`components/ui/ProjectVisual.jsx`).

---

## Regenerating the OG image

```bash
node scripts/build-og.mjs
```

Renders `scripts/og-template.html` to `public/og-image.png` at 1200×630. The
template uses the same tokens as the site, so the link-preview card cannot
drift away from the palette. PNG rather than SVG — most crawlers and chat
clients will not render an SVG preview.

---

## Capturing project screenshots

`scripts/capture-project.mjs` drives headless Chromium (with SwiftShader, so
WebGL/Three.js scenes render) and writes real screenshots into
`public/work/<slug>/`:

```bash
node scripts/capture-project.mjs https://theclient.com their-slug 0 0.35 0.7
```

The trailing numbers are scroll positions as a fraction of page height. The
first frame becomes `cover.jpg`; the rest become `shot-02.jpg`, `shot-03.jpg`…
Point `cover:` at the result in `data/projects.js` and it replaces the
generated artwork automatically.

Requires `npx playwright install chromium` once.

---

## Connecting the contact form

There is no backend. `src/lib/enquiry.js` is the single seam — copy
`.env.example` to `.env`:

| Provider  | `VITE_FORM_ENDPOINT`               | Access key |
| --------- | ---------------------------------- | ---------- |
| Formspree | `https://formspree.io/f/xxxxxxxx`  | no         |
| Basin     | `https://usebasin.com/f/xxxxxxxx`  | no         |
| Web3Forms | `https://api.web3forms.com/submit` | yes        |
| Your own  | anything accepting a JSON `POST`   | —          |

Without an endpoint the form validates and resolves as *captured but not
delivered* — it never pretends an email was sent.

The form carries a honeypot field (`company_website`) hidden from sight, tab
order and screen readers. Anything that fills it in is silently accepted and
dropped rather than told why it failed.

---

## Deploying

`netlify.toml` and `vercel.json` are both committed — SPA rewrites, immutable
caching on hashed assets, and baseline security headers. Either host builds
with `npm run build` and serves `dist`.

For anything else: build, serve `dist`, and rewrite all paths to
`/index.html`.

---

## The hero visual

`components/hero/HeroSculpture.jsx` draws a twisted lattice monolith on a 2D
canvas using hand-rolled 3D projection, lit by a single red rim light. No
dependency, ~6KB of logic, rAF pauses off-screen and in hidden tabs.

To swap in a Spline scene, replace one node in `HeroVisual.jsx` — the glow, HUD
chrome, masking and sizing are renderer-agnostic and stay put. The marked
`SPLINE SLOT` block has the snippet.

---

## Audit baseline

Run it yourself against the production build — start `npm run preview` in one
terminal, then:

```bash
node scripts/audit.mjs
```

| Performance | Accessibility | Best Practices | SEO |
| ----------- | ------------- | -------------- | --- |
| 95          | 96            | 100            | 100 |

FCP 2.0s · LCP 2.7s · TBT 50ms · CLS 0.009 (simulated slow 4G)

Two known items, both deliberate:

- **One contrast "failure"** — the oversized `S7 LABS` watermark in the footer.
  It is decoration, exempt under WCAG 1.4.3, and clearing 3:1 would need ~35%
  white, which turns a watermark into a headline. axe reports it regardless,
  because that rule ignores `aria-hidden` by design.
- **Unused JavaScript** — Framer Motion. Moving to `LazyMotion` + `domAnimation`
  with `m.*` components would cut roughly 30KB gzipped, but it is a wide
  mechanical refactor and has not been done.

---

## Notes

- Red is held to roughly 5% of the page. On the hero canvas it measures ~1.8%
  of pixels — a rim highlight, not a colour scheme.
- Motion respects `prefers-reduced-motion` three ways: `MotionConfig
  reducedMotion="user"`, a CSS `@media` block, and per-component gates for the
  canvas and cursor.
- The custom cursor and all magnetic/parallax effects are desktop-only
  (`hover: hover and pointer: fine`).
- Sections must use `overflow-x-clip`, never `overflow-hidden` — `hidden` makes
  the element a scroll container and pins `useScroll` progress.
- `public/_redirects` handles SPA routing on Netlify. For other hosts, rewrite
  all paths to `/index.html`.

## Before going live

- Add real social URLs in `socials` — entries with `href: null` don't render.
- **Set `VITE_SITE_URL` once the domain exists** (e.g. `https://s7labs.in`).
  Until then canonical, og:url, og:image and sitemap.xml are omitted rather
  than pointing at a domain nobody owns. Setting it fills all of them in and
  generates sitemap.xml from the live projects automatically.
- Contact email is `suyash.namdeo07@gmail.com` (`site.email`, one line). Swap
  for a branded address once the domain and mailbox exist.
