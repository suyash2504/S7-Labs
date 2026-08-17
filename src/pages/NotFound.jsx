import { PageTransition } from '@/components/layout/PageTransition'
import { Button } from '@/components/ui/Button'
import { Reveal, RevealLines } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { useSeo } from '@/lib/useSeo'

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page does not exist.' })

  return (
    <PageTransition>
      <section className="relative flex min-h-[80svh] items-center overflow-hidden py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid opacity-30"
          style={{
            maskImage: 'radial-gradient(55% 55% at 50% 45%, #000, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(55% 55% at 50% 45%, #000, transparent 80%)',
          }}
        />
        <div className="shell relative">
          <Reveal>
            <Eyebrow>Error 404</Eyebrow>
          </Reveal>

          <RevealLines
            as="h1"
            delay={0.06}
            lines={['Nothing', <span key="h">here.</span>]}
            className="mt-8 font-display text-d1 text-chalk uppercase"
          />

          <Reveal delay={0.18}>
            <p className="mt-8 max-w-md text-lead text-ash">
              The page you were after has moved, or never existed. Both are fixable.
            </p>
          </Reveal>

          <Reveal delay={0.26} className="mt-11 flex flex-wrap gap-3">
            <Button to="/" icon="right">
              Back to home
            </Button>
            <Button to="/work" variant="secondary" icon="right">
              See the work
            </Button>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}
