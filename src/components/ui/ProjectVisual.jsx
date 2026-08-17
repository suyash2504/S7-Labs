import { cn } from '@/lib/cn'

/**
 * ---------------------------------------------------------------------------
 * PROJECT VISUALS
 * ---------------------------------------------------------------------------
 * Each live project gets a bespoke geometric composition instead of a stock
 * screenshot. They are deterministic SVG — no images to download, they scale
 * to any card size, and they stay on-brand.
 *
 * To use a real screenshot instead, add `cover: '/work/<slug>/cover.webp'` to
 * the project in data/projects.js — this component prefers it automatically.
 * ---------------------------------------------------------------------------
 */

const VB = '0 0 800 600'

/** Tiny deterministic PRNG so the "random" pixel fields never re-shuffle. */
const rng = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

/* ---------------------------------------------------------------- APEX GYM */
function ApexVisual() {
  const r = rng(7)
  const plates = [
    { x: 196, w: 26, h: 210 },
    { x: 232, w: 18, h: 156 },
    { x: 262, w: 13, h: 112 },
  ]

  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <linearGradient id="apexFade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#151515" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <radialGradient id="apexGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E50914" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill="url(#apexFade)" />
      <ellipse cx="400" cy="300" rx="300" ry="230" fill="url(#apexGlow)" />

      {/* Force vectors */}
      <g stroke="#1e1e1e" strokeWidth="1">
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={-160 + i * 58} y1="620" x2={80 + i * 58} y2="-20" />
        ))}
      </g>

      {/* Load axis */}
      <g>
        <rect x="150" y="294" width="500" height="12" fill="#e9e9e9" />
        <rect x="150" y="294" width="500" height="3" fill="#ffffff" />
        {plates.map((p, i) => (
          <g key={`l${i}`}>
            <rect
              x={p.x}
              y={300 - p.h / 2}
              width={p.w}
              height={p.h}
              fill={i === 0 ? 'none' : '#1a1a1a'}
              stroke={i === 0 ? '#E50914' : '#4a4a4a'}
              strokeWidth={i === 0 ? 2 : 1}
            />
          </g>
        ))}
        {plates.map((p, i) => (
          <g key={`r${i}`}>
            <rect
              x={800 - p.x - p.w}
              y={300 - p.h / 2}
              width={p.w}
              height={p.h}
              fill={i === 0 ? 'none' : '#1a1a1a'}
              stroke={i === 0 ? '#E50914' : '#4a4a4a'}
              strokeWidth={i === 0 ? 2 : 1}
            />
          </g>
        ))}
      </g>

      {/* Travel arcs */}
      <g fill="none" stroke="#FF3B45" strokeOpacity="0.5" strokeWidth="1.5">
        <path d="M400 168a150 150 0 0 1 132 78" />
        <path d="M400 132a186 186 0 0 1 164 96" strokeOpacity="0.28" />
      </g>
      <g fill="none" stroke="#5a5a5a" strokeWidth="1">
        <path d="M400 432a150 150 0 0 0-132-78" />
      </g>

      {/* Measurement ticks */}
      <g stroke="#333" strokeWidth="1">
        {Array.from({ length: 26 }, (_, i) => (
          <line key={i} x1={60 + i * 27} y1="546" x2={60 + i * 27} y2={i % 4 === 0 ? 528 : 538} />
        ))}
        <line x1="60" y1="546" x2="735" y2="546" stroke="#2a2a2a" />
      </g>
      <rect x="60" y="524" width="3" height="22" fill="#E50914" />

      {/* Dust */}
      <g fill="#6a6a6a">
        {Array.from({ length: 26 }, (_, i) => (
          <rect key={i} x={r() * 800} y={r() * 600} width="2" height="2" opacity={0.2 + r() * 0.5} />
        ))}
      </g>
    </svg>
  )
}

/* -------------------------------------------------------- JOYSTICK JUNCTION */
function ArcadeVisual() {
  const r = rng(23)
  const cells = []
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 20; x++) {
      const v = r()
      if (v > 0.72) cells.push({ x, y, v })
    }
  }

  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <linearGradient id="arcadeBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#131313" />
          <stop offset="100%" stopColor="#090909" />
        </linearGradient>
        <radialGradient id="arcadeGlow" cx="34%" cy="38%" r="46%">
          <stop offset="0%" stopColor="#E50914" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill="url(#arcadeBg)" />

      {/* Pixel field */}
      <g>
        {cells.map((c, i) => (
          <rect
            key={i}
            x={c.x * 40}
            y={c.y * 40}
            width="40"
            height="40"
            fill={c.v > 0.965 ? '#E50914' : '#ffffff'}
            opacity={c.v > 0.965 ? 0.5 : (c.v - 0.7) * 0.34}
          />
        ))}
      </g>

      {/* Grid */}
      <g stroke="#1c1c1c" strokeWidth="1">
        {Array.from({ length: 21 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="600" />
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} />
        ))}
      </g>

      <ellipse cx="272" cy="228" rx="260" ry="220" fill="url(#arcadeGlow)" />

      {/* Joystick */}
      <g>
        <ellipse cx="272" cy="436" rx="132" ry="40" fill="#111" stroke="#3a3a3a" strokeWidth="1.5" />
        <ellipse cx="272" cy="428" rx="132" ry="40" fill="#161616" stroke="#4f4f4f" strokeWidth="1.5" />
        <path d="M262 400V254h20v146z" fill="#d8d8d8" />
        <path d="M262 400V254h7v146z" fill="#ffffff" />
        <circle cx="272" cy="222" r="52" fill="#E50914" />
        <circle cx="272" cy="222" r="52" fill="none" stroke="#FF3B45" strokeWidth="2" />
        <ellipse cx="255" cy="203" rx="17" ry="12" fill="#ffffff" opacity="0.24" />
      </g>

      {/* Buttons */}
      <g>
        {[
          { cx: 560, cy: 260, r: 42 },
          { cx: 668, cy: 318, r: 42 },
          { cx: 560, cy: 380, r: 42 },
        ].map((b, i) => (
          <g key={i}>
            <circle cx={b.cx} cy={b.cy + 8} r={b.r} fill="#0c0c0c" stroke="#2a2a2a" strokeWidth="1.5" />
            <circle
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              fill={i === 1 ? '#1a1a1a' : '#141414'}
              stroke={i === 1 ? '#E50914' : '#5a5a5a'}
              strokeWidth={i === 1 ? 2.5 : 1.5}
            />
            <circle cx={b.cx - 12} cy={b.cy - 13} r={9} fill="#ffffff" opacity="0.12" />
          </g>
        ))}
      </g>

      {/* Scanlines */}
      <g stroke="#000" strokeOpacity="0.34" strokeWidth="2">
        {Array.from({ length: 100 }, (_, i) => (
          <line key={i} x1="0" y1={i * 6} x2="800" y2={i * 6} />
        ))}
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------- PLACEHOLDER */
function PlaceholderVisual() {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <rect width="800" height="600" fill="#0b0b0b" />
      <g stroke="#191919" strokeWidth="1">
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1={-200 + i * 46} y1="620" x2={100 + i * 46} y2="-20" />
        ))}
      </g>
      <g stroke="#2b2b2b" strokeWidth="1.5" fill="none">
        <path d="M300 236h-42v-42M500 236h42v-42M300 364h-42v42M500 364h42v42" />
      </g>
      <circle cx="400" cy="300" r="5" fill="#8B0000" />
      <path d="M370 300h60M400 270v60" stroke="#242424" strokeWidth="1" />
    </svg>
  )
}

const VISUALS = { apex: ApexVisual, arcade: ArcadeVisual, placeholder: PlaceholderVisual }

/**
 * `priority` marks the one cover that is likely above the fold (the first
 * project in a reel). It loads eagerly at high fetch priority so it can be the
 * LCP element; every other cover stays lazy.
 */
export function ProjectVisual({ project, className, priority = false }) {
  const { visual, cover, title, coverAlt } = project

  if (cover) {
    return (
      <img
        src={cover}
        alt={coverAlt ?? `${title} — a screenshot of the site we designed and built`}
        width="1920"
        height="1200"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }

  const Visual = VISUALS[visual?.key] ?? PlaceholderVisual
  return (
    <div className={cn('h-full w-full', className)} role="img" aria-label={`${title} — cover artwork`}>
      <Visual />
    </div>
  )
}
