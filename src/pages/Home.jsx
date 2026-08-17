import { Hero } from '@/components/sections/Hero'
import { ServicesTicker } from '@/components/sections/ServicesTicker'
import { Intro } from '@/components/sections/Intro'
import { Services } from '@/components/sections/Services'
import { Portfolio } from '@/components/sections/Portfolio'
import { Process } from '@/components/sections/Process'
import { WhyS7 } from '@/components/sections/WhyS7'
import { About } from '@/components/sections/About'
import { Pricing } from '@/components/sections/Pricing'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { PageTransition } from '@/components/layout/PageTransition'
import { useSeo } from '@/lib/useSeo'

export default function Home() {
  useSeo({ path: '/' })

  return (
    <PageTransition>
      <Hero />
      <ServicesTicker />
      <Intro />
      <Services />
      <Portfolio />
      <Process />
      <WhyS7 />
      <About />
      <Pricing />
      <FinalCTA />
    </PageTransition>
  )
}
