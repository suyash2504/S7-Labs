import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, TriangleAlert } from 'lucide-react'
import { Field } from './Field'
import { Button } from '@/components/ui/Button'
import { services } from '@/data/services'
import { site, hasWhatsApp } from '@/data/site'
import { budgetOptions } from '@/data/pricing'
import { submitEnquiry, validateEnquiry, HONEYPOT } from '@/lib/enquiry'
import { EASE } from '@/lib/motion'

const EMPTY = {
  name: '',
  business: '',
  email: '',
  phone: '',
  service: '',
  budget: '',
  details: '',
  [HONEYPOT]: '',
}

/** Visual order — decides which field gets focus when validation fails. */
const FIELD_ORDER = ['name', 'business', 'email', 'phone', 'service', 'budget', 'details']

const serviceOptions = [
  { value: '', label: 'Select a service' },
  ...services.map((s) => ({ value: s.title, label: s.title })),
  { value: 'Not sure yet', label: 'Not sure yet' },
]

const budgetSelectOptions = [
  { value: '', label: 'Select a range' },
  ...budgetOptions.map((b) => ({ value: b, label: b })),
]

export function EnquiryForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [message, setMessage] = useState('')
  const formRef = useRef(null)

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validateEnquiry(values)
    setErrors(found)

    // Move focus to the first problem field. Query by id rather than by
    // [aria-invalid] — that attribute isn't committed until React re-renders.
    const firstBad = FIELD_ORDER.find((f) => found[f])
    if (firstBad) {
      formRef.current?.querySelector(`#${firstBad}`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const res = await submitEnquiry(values)
      setStatus('sent')
      setMessage(
        res.delivered
          ? "Thanks — your enquiry is with us. We'll reply within one working day."
          : // Only reachable on a dev build, where nothing is actually sent.
            'Thanks — your enquiry was captured. This is a development build, so it has not been delivered anywhere.',
      )
      setValues(EMPTY)
    } catch (err) {
      setStatus('error')
      // Only offer WhatsApp as a fallback if there is actually a number set.
      setMessage(
        `${err.message}. Please email us directly at ${site.email}${
          hasWhatsApp ? ", or reach us on WhatsApp — we'll pick it up there" : ''
        }.`,
      )
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative">
      <fieldset disabled={status === 'sending'} className="contents">
        <legend className="sr-only">Project enquiry</legend>

        <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          <Field
            id="name"
            label="Name"
            required
            autoComplete="name"
            placeholder="Your full name"
            value={values.name}
            onChange={update('name')}
            error={errors.name}
          />
          <Field
            id="business"
            label="Business"
            autoComplete="organization"
            placeholder="Company or brand"
            value={values.business}
            onChange={update('business')}
          />
          <Field
            id="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={update('email')}
            error={errors.email}
          />
          <Field
            id="phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91 00000 00000"
            value={values.phone}
            onChange={update('phone')}
            error={errors.phone}
          />
          <Field
            id="service"
            label="Service"
            as="select"
            options={serviceOptions}
            value={values.service}
            onChange={update('service')}
          />
          <Field
            id="budget"
            label="Budget"
            as="select"
            options={budgetSelectOptions}
            value={values.budget}
            onChange={update('budget')}
            hint="Starting prices only — quotes depend on scope."
          />
          <Field
            id="details"
            label="Project Details"
            as="textarea"
            required
            className="sm:col-span-2"
            placeholder="What are you building, who is it for, and what does success look like?"
            value={values.details}
            onChange={update('details')}
            error={errors.details}
          />

          {/* Honeypot. Hidden from sight, from the tab order and from screen
              readers — anything that fills it in is a bot. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label htmlFor={HONEYPOT}>Company website (leave blank)</label>
            <input
              id={HONEYPOT}
              name={HONEYPOT}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values[HONEYPOT]}
              onChange={update(HONEYPOT)}
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" size="lg" icon="right" magnetic={false}>
            {status === 'sending' ? 'Sending…' : 'Send Project Inquiry'}
          </Button>
          <p className="max-w-xs text-xs leading-relaxed text-smoke">
            We reply to every enquiry. No mailing list, no automated follow-ups.
          </p>
        </div>
      </fieldset>

      {/* Live status — announced to screen readers. */}
      <div aria-live="polite" className="mt-8">
        <AnimatePresence mode="wait">
          {(status === 'sent' || status === 'error') && (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className={`flex items-start gap-3.5 border px-5 py-4 ${
                status === 'sent' ? 'border-line bg-card' : 'border-red/40 bg-red/[0.06]'
              }`}
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  status === 'sent' ? 'bg-red text-white' : 'text-red-bright'
                }`}
              >
                {status === 'sent' ? (
                  <Check aria-hidden="true" strokeWidth={2.5} className="size-3" />
                ) : (
                  <TriangleAlert aria-hidden="true" strokeWidth={2} className="size-4" />
                )}
              </span>
              <p className="text-sm leading-relaxed text-ash">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
