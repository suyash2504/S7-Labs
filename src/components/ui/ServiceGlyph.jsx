/**
 * Abstract line glyphs for the services rows.
 * Hand-drawn geometry rather than icon-set pictograms — each one is a
 * diagram of the discipline, not a picture of it.
 */

const common = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
}

const GLYPHS = {
  lattice: (
    <>
      <rect x="18" y="18" width="84" height="84" stroke="#666" strokeWidth="1" {...common} />
      <rect
        x="34"
        y="34"
        width="52"
        height="52"
        stroke="#E50914"
        strokeWidth="1"
        transform="rotate(45 60 60)"
        {...common}
      />
      <path d="M18 60h84M60 18v84" stroke="#2e2e2e" strokeWidth="1" {...common} />
      <circle cx="60" cy="60" r="4" fill="#FF3B45" />
      <circle cx="18" cy="18" r="2" fill="#666" />
      <circle cx="102" cy="102" r="2" fill="#666" />
    </>
  ),
  stack: (
    <>
      <path d="M22 74l38-20 38 20-38 20z" stroke="#666" strokeWidth="1" {...common} />
      <path d="M22 58l38-20 38 20-38 20z" stroke="#8a8a8a" strokeWidth="1" {...common} />
      <path d="M22 42l38-20 38 20-38 20z" stroke="#E50914" strokeWidth="1" {...common} />
      <path d="M60 82v18" stroke="#2e2e2e" strokeWidth="1" {...common} />
      <circle cx="60" cy="42" r="3" fill="#FF3B45" />
    </>
  ),
  orbit: (
    <>
      <circle cx="60" cy="60" r="40" stroke="#2e2e2e" strokeWidth="1" {...common} />
      <ellipse cx="60" cy="60" rx="40" ry="15" stroke="#666" strokeWidth="1" {...common} />
      <ellipse
        cx="60"
        cy="60"
        rx="40"
        ry="15"
        stroke="#E50914"
        strokeWidth="1"
        transform="rotate(60 60 60)"
        {...common}
      />
      <ellipse
        cx="60"
        cy="60"
        rx="40"
        ry="15"
        stroke="#4a4a4a"
        strokeWidth="1"
        transform="rotate(-60 60 60)"
        {...common}
      />
      <circle cx="60" cy="60" r="5" fill="#FF3B45" />
    </>
  ),
  frame: (
    <>
      <rect x="16" y="26" width="88" height="68" stroke="#666" strokeWidth="1" {...common} />
      <path d="M16 42h88" stroke="#2e2e2e" strokeWidth="1" {...common} />
      <circle cx="25" cy="34" r="2" fill="#666" />
      <circle cx="33" cy="34" r="2" fill="#666" />
      <rect x="28" y="54" width="30" height="28" stroke="#E50914" strokeWidth="1" {...common} />
      <path d="M66 56h30M66 66h30M66 76h18" stroke="#4a4a4a" strokeWidth="1" {...common} />
      <path d="M28 54l30 28M58 54L28 82" stroke="#8B0000" strokeWidth="0.75" {...common} />
    </>
  ),
  pulse: (
    <>
      <path d="M14 60h20l8-22 12 44 10-30 8 16h34" stroke="#E50914" strokeWidth="1.25" {...common} />
      <path d="M14 88h92M14 32h92" stroke="#2e2e2e" strokeWidth="1" {...common} />
      <path
        d="M28 96v6M52 96v6M76 96v6M100 96v6"
        stroke="#4a4a4a"
        strokeWidth="1"
        {...common}
      />
      <circle cx="54" cy="82" r="3" fill="#FF3B45" />
    </>
  ),
}

export function ServiceGlyph({ name, className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" role="presentation">
      {GLYPHS[name] ?? GLYPHS.lattice}
    </svg>
  )
}
