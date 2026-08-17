import { motion } from 'framer-motion'
import { HeroSculpture } from './HeroSculpture'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * The hero's visual field.
 *
 * ┌── SPLINE SLOT ──────────────────────────────────────────────────────────┐
 * │ Swap <HeroSculpture /> below for a Spline scene without touching        │
 * │ anything else — the glow, HUD chrome, sizing and mask all live in this  │
 * │ wrapper and are renderer-agnostic:                                     │
 * │                                                                        │
 * │   const Spline = lazy(() => import('@splinetool/react-spline'))        │
 * │   <Suspense fallback={<HeroSculpture active={active} reduced />}>      │
 * │     <Spline scene="https://prod.spline.design/xxxx/scene.splinecode" />│
 * │   </Suspense>                                                          │
 * │                                                                        │
 * │ Keep the `active` gate so the scene only spins up after the headline   │
 * │ has landed — it protects the load-in from jank.                        │
 * └────────────────────────────────────────────────────────────────────────┘
 */
export function HeroVisual({ active, reduced, className }) {
  return (
    <div className={cn('relative h-full w-full', className)}>
      {/* Red light bloom behind the sculpture — CSS, so it costs nothing. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-18%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 2, delay: 0.5, ease: EASE }}
        style={{
          background:
            'radial-gradient(46% 40% at 56% 44%, rgba(229,9,20,0.20) 0%, rgba(139,0,0,0.10) 38%, rgba(8,8,8,0) 72%)',
        }}
      />

      {/* Faint reference grid — reads as a laboratory floor, not decoration. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.5]"
        style={{
          maskImage: 'radial-gradient(58% 58% at 50% 50%, #000 0%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(58% 58% at 50% 50%, #000 0%, transparent 78%)',
        }}
      />

      {/* ── SPLINE SLOT: replace this node ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.8, delay: 0.35, ease: EASE }}
        style={{
          maskImage: 'radial-gradient(72% 72% at 50% 50%, #000 42%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(72% 72% at 50% 50%, #000 42%, transparent 100%)',
        }}
      >
        <HeroSculpture active={active} reduced={reduced} />
      </motion.div>

      {/* HUD chrome */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.5, ease: EASE }}
      >
        <Bracket className="top-0 left-0 border-t border-l" />
        <Bracket className="top-0 right-0 border-t border-r" />
        <Bracket className="bottom-0 left-0 border-b border-l" />
        <Bracket className="right-0 bottom-0 border-r border-b" />

        <span className="absolute top-0 left-9 -translate-y-1/2 bg-void px-2 font-mono text-[0.625rem] tracking-[0.2em] text-smoke">
          S7 / STRUCTURE—01
        </span>

        <span className="absolute right-9 bottom-0 flex translate-y-1/2 items-center gap-2 bg-void px-2 font-mono text-[0.625rem] tracking-[0.2em] text-smoke">
          <span className="size-1 bg-red animate-pulse-dot" />
          21.2514° N / 81.6296° E
        </span>
      </motion.div>
    </div>
  )
}

const Bracket = ({ className }) => (
  <span className={cn('absolute size-7 border-line', className)} />
)
