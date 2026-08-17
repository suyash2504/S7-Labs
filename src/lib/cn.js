/** Tiny classnames joiner — avoids pulling in clsx for a 12-line helper. */
export function cn(...parts) {
  const out = []
  for (const p of parts) {
    if (!p) continue
    if (typeof p === 'string' || typeof p === 'number') out.push(p)
    else if (Array.isArray(p)) {
      const nested = cn(...p)
      if (nested) out.push(nested)
    } else if (typeof p === 'object') {
      for (const k in p) if (p[k]) out.push(k)
    }
  }
  return out.join(' ')
}
