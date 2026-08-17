import { PageTransition } from '@/components/layout/PageTransition'
import { PageHeader } from '@/components/layout/PageHeader'
import { EnquiryForm } from '@/components/contact/EnquiryForm'
import { Reveal, LineRule } from '@/components/ui/Reveal'
import { site, whatsappUrl, hasWhatsApp } from '@/data/site'
import { pricingDisclaimer } from '@/data/pricing'
import { useSeo } from '@/lib/useSeo'
import { useCopy } from '@/lib/hooks'

export default function Contact() {
  useSeo({
    title: 'Contact',
    description:
      'Start a project with S7 Labs. Tell us what you are building and we will come back with scope, timeline and a quote.',
    path: '/contact',
  })

  return (
    <PageTransition>
      <PageHeader
        index="(01)"
        eyebrow="Contact"
        title={["Let's talk."]}
        lede="Tell us what you're working on. Scope, timeline and a real quote come back from there."
      />

      <section className="py-20 sm:py-28 lg:py-32">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <h2 className="label text-smoke">Direct</h2>
              <ul className="mt-6 space-y-5">
                <li>
                  <CopyRow value={site.email} label="Email" />
                </li>
                {hasWhatsApp && (
                  <li>
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border border-line px-5 py-4 transition-colors duration-400 hover:border-red/60 hover:bg-red/[0.05]"
                    >
                      <span className="text-sm font-medium text-chalk">WhatsApp Us</span>
                      <span
                        aria-hidden="true"
                        className="text-xs text-smoke transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                )}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="mt-12">
              <LineRule />
              <dl className="mt-8 space-y-7">
                <div>
                  <dt className="label text-smoke">Studio</dt>
                  <dd className="mt-2.5 text-sm text-ash">{site.location}</dd>
                </div>
                <div>
                  <dt className="label text-smoke">Working with</dt>
                  <dd className="mt-2.5 text-sm text-ash">
                    Businesses of any size, anywhere — most of our work happens remotely.
                  </dd>
                </div>
                <div>
                  <dt className="label text-smoke">What to include</dt>
                  <dd className="mt-2.5 text-sm leading-relaxed text-ash">
                    What you&rsquo;re building, who it&rsquo;s for, any deadline you&rsquo;re
                    working to, and a link to anything you already have.
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.14} className="mt-12">
              <p className="border-l border-red/50 pl-5 text-xs leading-relaxed text-smoke">
                {pricingDisclaimer}
              </p>
            </Reveal>
          </aside>
        </div>
      </section>
    </PageTransition>
  )
}

function CopyRow({ value, label }) {
  const [copied, copy] = useCopy()

  return (
    <div className="flex items-stretch border border-line">
      <a
        href={`mailto:${value}`}
        className="flex-1 px-5 py-4 text-sm text-chalk transition-colors hover:text-white"
      >
        <span className="label block text-smoke">{label}</span>
        <span className="mt-1.5 block">{value}</span>
      </a>
      <button
        type="button"
        onClick={() => copy(value)}
        className="label shrink-0 cursor-pointer border-l border-line px-4 text-smoke transition-colors hover:bg-red/[0.07] hover:text-chalk"
        aria-label={`Copy ${label.toLowerCase()} address`}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
