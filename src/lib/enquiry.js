/**
 * ---------------------------------------------------------------------------
 * ENQUIRY SUBMISSION
 * ---------------------------------------------------------------------------
 * The single seam between the contact form and whatever delivers it. No
 * component knows which provider is in use.
 *
 * Setup — copy `.env.example` to `.env` and fill in:
 *
 *   Formspree   VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
 *   Basin       VITE_FORM_ENDPOINT=https://usebasin.com/f/xxxxxxxx
 *   Web3Forms   VITE_FORM_ENDPOINT=https://api.web3forms.com/submit
 *               VITE_FORM_ACCESS_KEY=your-access-key
 *   Your own    VITE_FORM_ENDPOINT=https://api.yoursite.com/enquiries
 *
 * All of the above accept a JSON POST, so no provider-specific code is needed
 * beyond the optional access key.
 *
 * With no endpoint configured the submission resolves as `delivered: false`,
 * and the UI says so plainly rather than pretending an email was sent.
 * ---------------------------------------------------------------------------
 */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT
const ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY

/** Field name for the honeypot. Bots fill it; humans never see it. */
export const HONEYPOT = 'company_website'

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
    console.info('[S7] Enquiry captured (no VITE_FORM_ENDPOINT configured):', body)
    await new Promise((r) => setTimeout(r, 700))
    return { ok: true, delivered: false }
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
