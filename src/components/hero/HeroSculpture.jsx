import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'

/**
 * ---------------------------------------------------------------------------
 * S7 // STRUCTURE-01
 * ---------------------------------------------------------------------------
 * A bespoke "digital sculpture" drawn on a 2D canvas with hand-rolled 3D math:
 * a twisted lattice monolith of stacked rings, lit by a single red rim light
 * that travels around it as it rotates.
 *
 * Why canvas and not a library: it is ~6KB of logic with zero dependencies,
 * paints in one pass, and gives exact control over the depth falloff — which is
 * what makes it read as a sculpture rather than a spinning wireframe.
 *
 * Performance notes:
 *   · Segments are bucketed by brightness and stroked as 4 paths per frame.
 *   · rAF halts when the element leaves the viewport or the tab is hidden.
 *   · DPR capped at 2.
 *   · Reduced motion → one static frame, no loop.
 * ---------------------------------------------------------------------------
 */

/* Facet count is the single most important number here. At 40+ segments the
   rings resolve into smooth curves and the whole thing reads as something
   organic — a cocoon. Twelve keeps them visibly faceted, so it reads as
   engineered: a machined tower rather than a grown one. */
const RINGS = 34
const SEGMENTS = 12
const SPOKE_EVERY = 1
const CAM_Z = 3.35
const FOCAL = 2.55

/* Silhouette. The low exponent is deliberate: sin(πt) on its own tapers to a
   point at both poles, which reads as a pod. Raising it to ~0.3 makes the
   radius jump almost immediately, leaving flat caps and a gently barrelled
   shaft — a cut column rather than an egg. */
const profile = (t) => 0.28 + 0.2 * Math.sin(Math.PI * t) ** 0.3

export function HeroSculpture({ active = false, reduced = false, className }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const pointer = useRef({ tx: 0, ty: 0, x: 0, y: 0 })
  const intro = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d', { alpha: true })
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let t0 = performance.now()
    let clock = 0

    /* ---------------------------------------------------------------- size */
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.max(1, Math.round(r.width))
      h = Math.max(1, Math.round(r.height))
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    /* ------------------------------------------------------------- pointer */
    const onPointer = (e) => {
      const r = wrap.getBoundingClientRect()
      // Track relative to the whole viewport so the sculpture reacts even when
      // the pointer is over the headline.
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.ty = ((e.clientY - r.top) / Math.max(r.height, 1)) * 2 - 1
    }
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true })

    /* ------------------------------------------------------------ geometry */
    const cosA = new Float32Array(SEGMENTS + 1)
    const sinA = new Float32Array(SEGMENTS + 1)
    for (let j = 0; j <= SEGMENTS; j++) {
      const a = (j / SEGMENTS) * Math.PI * 2
      cosA[j] = Math.cos(a)
      sinA[j] = Math.sin(a)
    }

    // Reused per-frame buffers — no allocation inside the loop.
    const px = new Float32Array((RINGS + 1) * (SEGMENTS + 1))
    const py = new Float32Array((RINGS + 1) * (SEGMENTS + 1))
    const pz = new Float32Array((RINGS + 1) * (SEGMENTS + 1))
    const pl = new Float32Array((RINGS + 1) * (SEGMENTS + 1)) // rim-light term

    const dust = Array.from({ length: 46 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 0.85 + Math.random() * 0.95,
      y: (Math.random() - 0.5) * 2.5,
      s: 0.15 + Math.random() * 0.5,
    }))

    /* ---------------------------------------------------------------- draw */
    const draw = (time) => {
      const dt = Math.min((time - t0) / 1000, 0.05)
      t0 = time
      if (!reduced) clock += dt

      // Ease the intro in over ~1.5s once the hero says go.
      if (active && intro.current < 1) intro.current = Math.min(1, intro.current + dt / 1.5)
      const p = reduced ? (active ? 1 : 0) : easeOutExpo(intro.current)
      if (p <= 0.001) return

      // Pointer easing.
      const pt = pointer.current
      pt.x += (pt.tx - pt.x) * 0.055
      pt.y += (pt.ty - pt.y) * 0.055

      ctx.clearRect(0, 0, w, h)

      const cx = w / 2
      const cy = h / 2
      const scale = Math.min(w, h) * 0.44

      const spin = clock * 0.16 + pt.x * 0.55
      const tilt = -0.14 + pt.y * 0.22
      const cs = Math.cos(spin)
      const ss = Math.sin(spin)
      const ct = Math.cos(tilt)
      const st = Math.sin(tilt)

      // Rim light. Parked front-left and breathing within a narrow arc: swing
      // it through head-on and the lit band collapses onto the face (red floods
      // the silhouette); swing it past 90° and it lands behind the object and
      // the red vanishes. This arc keeps a stable edge highlight either way.
      const la = Math.PI / 2 + 0.82 + Math.sin(clock * 0.19) * 0.33
      const lx = Math.cos(la)
      const lz = Math.sin(la)

      // A soft band that sweeps the column, briefly lifting rings it passes.
      const sweep = ((clock * 0.13) % 1.6) - 0.3

      /* -- project every vertex ------------------------------------------ */
      for (let i = 0; i <= RINGS; i++) {
        const t = i / RINGS
        const rad = profile(t) * (0.6 + 0.4 * p)
        const yy = (t - 0.5) * 2.45
        const twist = t * 3.9 + clock * 0.3
        const tc = Math.cos(twist)
        const ts = Math.sin(twist)

        for (let j = 0; j <= SEGMENTS; j++) {
          // ring point, pre-twisted around its own axis
          const bx = cosA[j] * tc - sinA[j] * ts
          const bz = cosA[j] * ts + sinA[j] * tc
          let X = bx * rad
          let Z = bz * rad
          let Y = yy

          // rotate Y (spin)
          const x1 = X * cs - Z * ss
          const z1 = X * ss + Z * cs
          // rotate X (tilt)
          const y2 = Y * ct - z1 * st
          const z2 = Y * st + z1 * ct

          const idx = i * (SEGMENTS + 1) + j
          const depth = CAM_Z - z2
          const k = (FOCAL / depth) * scale
          px[idx] = cx + x1 * k
          py[idx] = cy - y2 * k
          pz[idx] = z2

          // Surface normal ≈ radial direction, rotated the same way.
          const nx = bx * cs - bz * ss
          const nz = bx * ss + bz * cs

          // A rim light peaks at GRAZING angles, not where the surface faces
          // the lamp. Weighting silhouette-ness above the lambert term is what
          // keeps red on the edge of the column instead of across its face.
          const sil = 1 - Math.abs(nz) // 1 at the silhouette, 0 head-on
          const lit = nx * lx + nz * lz
          const band = Math.max(0, 1 - Math.abs(t - (sweep + 0.15)) * 7)
          pl[idx] = 0.75 * sil + 0.25 * lit + 0.15 * band
        }
      }

      /* -- bucket segments by brightness, stroke 4 paths ------------------ */
      const dim = new Path2D()
      const mid = new Path2D()
      const hot = new Path2D()
      const red = new Path2D()

      const push = (idxA, idxB, lightA) => {
        // Depth 0 (far) → 1 (near)
        const d = clamp((pz[idxA] + 1.15) / 2.3, 0, 1)
        const l = lightA * 0.5 + 0.5
        // Red is reserved for the very peak of the rim term on the near face.
        // It has to read as a highlight travelling over a grey object — the
        // moment red claims the whole silhouette, the 5% accent budget is gone.
        const path =
          // d > 0.42 rather than 0.5: the silhouette itself sits at d ≈ 0.5, so
          // a stricter test would reject the exact band we want to light.
          lightA > 0.88 && d > 0.42
            ? red
            : d * 0.55 + l * 0.65 > 0.84
              ? hot
              : d > 0.5
                ? mid
                : dim
        path.moveTo(px[idxA], py[idxA])
        path.lineTo(px[idxB], py[idxB])
      }

      const shownRings = Math.ceil(RINGS * clamp(p * 1.15, 0, 1))

      for (let i = 0; i <= shownRings; i++) {
        const base = i * (SEGMENTS + 1)
        for (let j = 0; j < SEGMENTS; j++) push(base + j, base + j + 1, pl[base + j])

        // Lattice spokes to the next ring.
        if (i < shownRings) {
          const next = (i + 1) * (SEGMENTS + 1)
          const off = i % SPOKE_EVERY
          for (let j = off; j < SEGMENTS; j += SPOKE_EVERY) push(base + j, next + j, pl[base + j] * 0.75)
        }
      }

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.globalAlpha = 0.36 * p
      ctx.strokeStyle = '#454545'
      ctx.lineWidth = 0.7
      ctx.stroke(dim)

      ctx.globalAlpha = 0.66 * p
      ctx.strokeStyle = '#8c8c8c'
      ctx.lineWidth = 0.85
      ctx.stroke(mid)

      ctx.globalAlpha = 1 * p
      ctx.strokeStyle = '#f4f4f4'
      ctx.lineWidth = 1.1
      ctx.stroke(hot)

      // Red rim light — the only saturated thing on screen.
      ctx.globalAlpha = 0.85 * p
      ctx.strokeStyle = '#FF3B45'
      ctx.lineWidth = 1.2
      ctx.shadowBlur = 3
      ctx.shadowColor = 'rgba(229,9,20,0.5)'
      ctx.stroke(red)
      ctx.shadowBlur = 0

      /* -- axis + dust ---------------------------------------------------- */
      ctx.globalAlpha = 0.22 * p
      ctx.strokeStyle = '#242424'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx, cy - scale * 1.35)
      ctx.lineTo(cx, cy + scale * 1.35)
      ctx.stroke()

      ctx.globalAlpha = p
      for (const d of dust) {
        const a = d.a + clock * 0.05 * d.s
        const X = Math.cos(a) * d.r
        const Z = Math.sin(a) * d.r
        const x1 = X * cs - Z * ss
        const z1 = X * ss + Z * cs
        const y2 = d.y * ct - z1 * st
        const z2 = d.y * st + z1 * ct
        const k = (FOCAL / (CAM_Z - z2)) * scale
        const alpha = clamp((z2 + 1.4) / 2.8, 0.05, 1) * 0.55
        ctx.globalAlpha = alpha * p
        ctx.fillStyle = d.s > 0.82 ? '#E50914' : '#8a8a8a'
        ctx.fillRect(cx + x1 * k, cy - y2 * k, 1.4, 1.4)
      }
      ctx.globalAlpha = 1
    }

    /* ---------------------------------------------------------------- loop */
    const loop = (time) => {
      draw(time)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (raf) return
      t0 = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    if (reduced) {
      // Single frame, no loop.
      intro.current = 1
      draw(performance.now())
    } else {
      start()
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (reduced) return
        visible ? start() : stop()
      },
      { threshold: 0 },
    )
    io.observe(wrap)

    const onVisibility = () => {
      if (reduced) return
      document.hidden || !visible ? stop() : start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [active, reduced])

  return (
    <div ref={wrapRef} className={cn('relative h-full w-full', className)} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))
