import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'

/**
 * ---------------------------------------------------------------------------
 * PROJECT INDEX
 * ---------------------------------------------------------------------------
 * The archive-style listing: one hairline row per project, with the cover
 * image following the cursor on hover.
 *
 * It replaces a stack of full-bleed cards that grew by roughly a screen per
 * project — ten projects ran to 4.5 screens, so the last five were never
 * reached. This holds ten in under one.
 *
 * The preview is a progressive enhancement and nothing depends on it: it only
 * mounts for devices that report a fine pointer, it is aria-hidden, and the
 * rows are ordinary links that work identically without it. Touch and keyboard
 * users simply never see it.
 * ---------------------------------------------------------------------------
 */

const FOLLOW = 0.16 // lerp factor — lower trails further behind the cursor
const OFFSET_X = 200 // px right of the cursor, so the card never covers the title
const CARD = { w: 320, h: 240 }
const EDGE = 24

/** Keeps the card beside the cursor but fully on screen near the edges. */
function place(x, y) {
  const half = { w: CARD.w / 2, h: CARD.h / 2 }
  let cx = x + OFFSET_X
  // Flip to the left of the cursor rather than letting it slide off-screen.
  if (cx + half.w > window.innerWidth - EDGE) cx = x - OFFSET_X
  cx = Math.min(Math.max(cx, half.w + EDGE), window.innerWidth - half.w - EDGE)
  const cy = Math.min(Math.max(y, half.h + EDGE), window.innerHeight - half.h - EDGE)
  return { cx, cy }
}

function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const apply = () => setFine(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return fine
}

function HoverPreview({ src, active }) {
  const ref = useRef(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onMove = (e) => {
      const { cx, cy } = place(e.clientX, e.clientY)
      target.current = { x: cx, y: cy }
      if (reduce) {
        pos.current = { ...target.current }
        el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
        return
      }
      if (!raf.current) raf.current = requestAnimationFrame(tick)
    }

    const tick = () => {
      const p = pos.current
      const t = target.current
      p.x += (t.x - p.x) * FOLLOW
      p.y += (t.y - p.y) * FOLLOW
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`

      // Keep animating only while there is meaningful distance left to cover.
      if (Math.abs(t.x - p.x) > 0.5 || Math.abs(t.y - p.y) > 0.5) {
        raf.current = requestAnimationFrame(tick)
      } else {
        raf.current = 0
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
      raf.current = 0
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={[
        'pointer-events-none fixed top-0 left-0 z-40 hidden h-[15rem] w-[20rem] overflow-hidden',
        'border border-line bg-carbon lg:block',
        'transition-[opacity,scale] duration-500 ease-out-expo',
        active ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
      ].join(' ')}
    >
      {src && (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  )
}

function Row({ project, onEnter, onLeave }) {
  const upcoming = project.status === 'upcoming'

  const inner = (
    <div
      className={[
        'grid grid-cols-[2.5rem_1fr] items-center gap-4 py-6 sm:gap-8',
        'lg:grid-cols-[3.5rem_1fr_auto_5rem]',
        'transition-[padding,background-color] duration-500 ease-out-expo',
        upcoming ? '' : 'group-hover:bg-carbon lg:group-hover:pl-5',
      ].join(' ')}
    >
      <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-smoke">
        {project.number}
      </span>

      <span
        className={[
          'font-display text-xl tracking-tight uppercase transition-colors duration-300 sm:text-3xl lg:text-[2rem]',
          upcoming ? 'text-smoke' : 'text-chalk group-hover:text-red-bright',
        ].join(' ')}
      >
        {project.title}
      </span>

      <span className="hidden text-sm text-smoke lg:block lg:text-right">
        {project.category}
      </span>

      <span className="hidden font-mono text-[0.6875rem] tracking-[0.2em] text-smoke lg:block lg:text-right">
        {upcoming ? 'SOON' : project.year}
      </span>
    </div>
  )

  if (upcoming) {
    return <div className="group px-1 opacity-50">{inner}</div>
  }

  return (
    <Link
      to={`/work/${project.slug}`}
      className="group block px-1"
      onMouseEnter={() => onEnter(project)}
      onMouseLeave={onLeave}
      onFocus={onLeave}
    >
      {inner}
    </Link>
  )
}

export function ProjectIndex({ projects }) {
  const fine = useFinePointer()
  const [hovered, setHovered] = useState(null)

  const onEnter = useCallback((project) => setHovered(project), [])
  const onLeave = useCallback(() => setHovered(null), [])

  return (
    <>
      <ul>
        {projects.map((project, i) => (
          <Reveal
            as="li"
            key={project.slug}
            delay={Math.min(i * 0.04, 0.32)}
            className="border-t border-line"
          >
            <Row project={project} onEnter={onEnter} onLeave={onLeave} />
          </Reveal>
        ))}
        <li className="border-t border-line" />
      </ul>

      {/* Mounted once and kept alive so the image is not refetched per hover. */}
      {fine && <HoverPreview src={hovered?.cover} active={!!hovered} />}
    </>
  )
}
