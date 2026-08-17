/**
 * Pricing preview. These are STARTING prices — the disclaimer under the
 * grid is not optional, keep it wherever this data is rendered.
 */

export const pricingTiers = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'From ₹9,999',
    description: 'For small businesses starting their digital presence.',
    includes: [
      'Multi-section responsive website',
      'Custom design direction',
      'Mobile-first build',
      'Basic on-page SEO',
      'Contact & enquiry setup',
    ],
    featured: false,
  },
  {
    id: 'business',
    name: 'Business',
    price: 'From ₹19,999',
    description: 'For growing businesses that need a stronger online presence.',
    includes: [
      'Everything in Starter',
      'Extended page architecture',
      'CMS / content editing',
      'Motion & interaction design',
      'Performance & SEO pass',
      'Analytics setup',
    ],
    featured: true,
  },
  {
    id: 'custom',
    name: 'Custom',
    price: 'From ₹30,000+',
    description: 'For custom digital experiences and advanced requirements.',
    includes: [
      'Everything in Business',
      'Bespoke design system',
      'Advanced motion / 3D',
      'Custom integrations',
      'Ongoing maintenance plan',
    ],
    featured: false,
  },
]

export const pricingNote = 'E-commerce projects from ₹45,000+'

export const pricingDisclaimer =
  'Prices are starting prices. Final quotes depend on scope, complexity and timeline.'

/** Budget bands for the contact form — kept next to pricing so they stay aligned. */
export const budgetOptions = [
  'Under ₹10K',
  '₹10K–₹25K',
  '₹25K–₹50K',
  '₹50K+',
  'Not sure',
]
