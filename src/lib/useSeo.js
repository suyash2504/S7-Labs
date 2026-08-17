import { useEffect } from 'react'

const DEFAULTS = {
  title: 'S7 Labs — Digital Experiences That Move Businesses Forward',
  description:
    'S7 Labs designs and develops premium websites, digital experiences and brand identities for modern businesses.',
}

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector)
  if (el && value) el.setAttribute(attr, value)
}

/**
 * Per-route document metadata. Keeps <title>, the description and the OG tags
 * in sync when the router swaps pages — no react-helmet dependency needed.
 */
export function useSeo({ title, description, path } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — S7 Labs` : DEFAULTS.title
    const desc = description || DEFAULTS.description

    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', desc)

    if (path) {
      const url = `https://s7labs.in${path}`
      setMeta('meta[property="og:url"]', 'content', url)
      setMeta('link[rel="canonical"]', 'href', url)
    }
  }, [title, description, path])
}
