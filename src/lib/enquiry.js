/**
 * ---------------------------------------------------------------------------
 * ENQUIRY SUBMISSION
 * ---------------------------------------------------------------------------
 * The single seam between the contact form and whatever delivers it. No
 * component knows which provider is in use.
 *
 * Delivery is decided in this order:
 *
 *   1. VITE_FORM_ENDPOINT set   -> JSON POST to that endpoint.
 *   2. Production build         -> Netlify Forms.
 *   3. Anything else (dev)      -> captured, not delivered, and said so.
 *
 * Netlify Forms is the default because the site is hosted there and it needs
 * no keys and no third party: the form is declared statically in index.html,
 * and this posts to it. Submissions land in the Netlify dashboard, with email
 * notifications configured there.
 *
 * To use a different provider instead, copy `.env.example` to `.env` and set:
 *
 *   Formspree   VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
 *   Basin       VITE_FORM_ENDPOINT=https://usebasin.com/f/xxxxxxxx
 *   Web3Forms   VITE_FORM_ENDPOINT=https://api.web3forms.com/submit
 *               VITE_FORM_ACCESS_KEY=your-access-key
 *   Your own    VITE_FORM_ENDPOINT=https://api.yoursite.com/enquiries
 *
 * All of the above accept a JSON POST, so no provider-specific code is needed
 * beyond the optional access key.
 * ---------------------------------------------------------------------------
 */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT
const ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY

/** Must match the `name` on the static form in index.html. */
const NETLIFY_FORM = 'enquiry'

/** Field name for the honeypot. Bots fill it; humans never see it. */
export const HONEYPOT = 'company_website'

/**
 * Netlify accepts AJAX submissions as urlencoded form data, not JSON — the
 * same encoding a plain <form> POST would use. Posting to "/" is the
 * documented target; the form is identified by the form-name field.
 */
async function submitToNetlify(body) {
  const params = new URLSearchParams({ 'form-name': NETLIFY_FORM })
  for (const [key, value] of Object.entries(body)) {
    if (value != null) params.append(key, String(value))
  }

  let res
  try {
    res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
  } catch {
    throw new Error("We couldn't reach the server")
  }

  if (!res.ok) throw new Error(`Submission failed (${res.status})`)
  return { ok: true, delivered: true }
}

export async function submitEnquiry(payload) {
  // Silently succeed for bots — never tell them why they failed.
  if (payload[HONEYPOT]) return { ok: true, delivered: false, spam: true }

  const { [HONEYPOT]: _trap, ...fields } = payload

  const body = {
    ...fields,
    ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
    // Gives the inbox a useful subject line instead of "New submission".
    subject: `S7 Labs enquiry — ${fields.name || 'Unknown'}${fields.business ? ` (${fields.business})` : ''}`,
    submittedAt: new Date().toISOString(),
    source: typeof window !== 'undefined' ? window.location.href : 'unknown',
  }

  if (!ENDPOINT) {
    // The dev server answers any POST with index.html and a 200, so going
    // through with it here would report a delivery that never happened.
    if (import.meta.env.DEV) {
      console.info('[S7] Enquiry captured (dev build — nothing is delivered):', body)
      await new Promise((r) => setTimeout(r, 700))
      return { ok: true, delivered: false }
    }
    return submitToNetlify(body)
  }

  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    // Offline, DNS failure, blocked request — never a status code.
    throw new Error("We couldn't reach the server")
  }

  if (!res.ok) {
    // Most providers return a JSON body explaining the rejection.
    let detail = ''
    try {
      const data = await res.json()
      detail = data?.message || data?.error || data?.errors?.[0]?.message || ''
    } catch {
      /* non-JSON error body — the status code is all we have */
    }
    throw new Error(detail || `Submission failed (${res.status})`)
  }

  return { ok: true, delivered: true }
}

/** Field-level validation shared by the form and its error summary. */
export function validateEnquiry(values) {
  const errors = {}
  if (!values.name?.trim()) errors.name = 'Please tell us your name.'
  if (!values.email?.trim()) errors.email = 'We need an email to reply to.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = 'That email address looks incomplete.'
  if (values.phone && !/^[\d+\-()\s]{7,20}$/.test(values.phone.trim()))
    errors.phone = 'Please check the phone number.'
  if (!values.details?.trim()) errors.details = 'A sentence or two is enough to start.'
  else if (values.details.trim().length < 12)
    errors.details = 'A little more detail helps us reply properly.'
  return errors
}
