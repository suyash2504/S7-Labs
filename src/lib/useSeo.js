import { site } from '@/data/site'
import { SEO_DEFAULTS, getRoute } from '@/data/routes'
import { useEffect } from 'react'

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector)
  if (el && value) el.setAttribute(attr, value)
}

/**
 * Per-route document metadata. Keeps <title>, the description and the OG tags
 * in sync when the router swaps pages — no react-helmet dependency needed.
 *
 * Title and description normally come from the route table, so the HTML the
 * build writes for a route and the HTML React renders for it cannot drift.
 * Pass them explicitly only for pages that aren't in the table (an unknown
 * case-study slug, say) — an explicit value always wins.
 */
export function useSeo({ title, description, path } = {}) {
  useEffect(() => {
    const entry = path ? getRoute(path) : undefined

    const fullTitle = title ? `${title} — S7 Labs` : entry?.title || SEO_DEFAULTS.title
    const desc = description || entry?.description || SEO_DEFAULTS.description

    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', desc)

    // Only claim a canonical URL once a real origin is configured. Asserting
    // one for a domain that isn't ours would be worse than asserting none.
    if (path && site.url) {
      const url = `${site.url}${path}`
      setMeta('meta[property="og:url"]', 'content', url)
      setMeta('link[rel="canonical"]', 'href', url)
    }
  }, [title, description, path])
}
