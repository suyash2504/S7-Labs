/**
 * Services rendered as expandable editorial rows.
 * `tags` show up in the expanded panel; `glyph` selects the abstract visual
 * drawn by <ServiceGlyph />.
 */

export const services = [
  {
    id: 'web',
    number: '01',
    title: 'Web Design & Development',
    summary:
      'Modern, responsive websites designed around your business and your audience.',
    detail:
      'We start with what the site actually has to do — then design and build it end to end. Structure, interface, motion, code, deployment.',
    tags: ['Design Systems', 'React & Next.js', 'CMS Integration', 'Performance'],
    glyph: 'lattice',
  },
  {
    id: 'ecommerce',
    number: '02',
    title: 'E-Commerce',
    summary:
      'Online stores designed to create better customer experiences and drive conversions.',
    detail:
      'Product pages, catalogue architecture, checkout flow and payments — built so browsing feels effortless and buying feels obvious.',
    tags: ['Storefront UX', 'Checkout Flow', 'Payments', 'Catalogue Architecture'],
    glyph: 'stack',
  },
  {
    id: 'branding',
    number: '03',
    title: 'Branding',
    summary:
      'Distinctive identities that help businesses become recognizable and memorable.',
    detail:
      'Positioning, naming direction, logo, colour, typography and the rules that keep it consistent everywhere it shows up.',
    tags: ['Identity', 'Logo Design', 'Typography', 'Brand Guidelines'],
    glyph: 'orbit',
  },
  {
    id: 'uiux',
    number: '04',
    title: 'UI / UX',
    summary: 'Interfaces designed to be intuitive, useful and enjoyable.',
    detail:
      'Research, flows, wireframes and high-fidelity interface design — with prototypes you can click through before a line of code exists.',
    tags: ['User Flows', 'Wireframes', 'Prototyping', 'Interaction Design'],
    glyph: 'frame',
  },
  {
    id: 'maintenance',
    number: '05',
    title: 'Maintenance',
    summary: 'Ongoing technical support, updates and improvements after launch.',
    detail:
      'Monitoring, security patches, content updates and iterative improvements — so the site keeps getting better instead of quietly ageing.',
    tags: ['Monitoring', 'Security Updates', 'Content Support', 'Optimization'],
    glyph: 'pulse',
  },
]
