import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { ScrollManager } from '@/components/layout/ScrollManager'
import { CustomCursor } from '@/components/layout/CustomCursor'
import Home from '@/pages/Home'

/* Home ships with the first paint; everything else is split out. */
const Work = lazy(() => import('@/pages/Work'))
const CaseStudy = lazy(() => import('@/pages/CaseStudy'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  const location = useLocation()

  return (
    // `reducedMotion="user"` makes every Framer animation on the site respect
    // the OS setting without a single per-component branch.
    <MotionConfig reducedMotion="user">
      <div aria-hidden="true" className="grain-overlay" />

      <ScrollManager />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />

      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<CaseStudy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
    </MotionConfig>
  )
}

/** Minimal hold state — a loader would be slower than the chunk it announces. */
function RouteFallback() {
  return <div className="min-h-[70svh]" aria-busy="true" aria-live="polite" />
}
