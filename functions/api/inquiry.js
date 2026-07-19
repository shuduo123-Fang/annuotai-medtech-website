const RECIPIENT_EMAIL = 'shuduo.fang@gmail.com'
const SENDER_EMAIL = 'contact@annuotaimedtech.com'

const limits = {
  firstName: 80,
  lastName: 80,
  email: 254,
  organization: 160,
  audience: 80,
  message: 4000,
}

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'",
    },
  })
}

function cleanField(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function cleanSingleLine(value, maxLength) {
  return cleanField(value, maxLength).replace(/\s+/g, ' ')
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function onRequestPost(context) {
  const { request, env } = context
  const requestUrl = new URL(request.url)
  const origin = request.headers.get('Origin')

  if (origin && origin !== requestUrl.origin) {
    return jsonResponse({ error: 'This request was not accepted.' }, 403)
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0)
  if (contentLength > 25_000) {
    return jsonResponse({ error: 'Your message is too large.' }, 413)
  }

  if (!request.headers.get('Content-Type')?.includes('application/json')) {
    return jsonResponse({ error: 'This form submission is not supported.' }, 415)
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ error: 'We could not read your inquiry.' }, 400)
  }

  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return jsonResponse({ error: 'We could not read your inquiry.' }, 400)
  }

  if (typeof payload.website === 'string' && payload.website.trim()) {
    return jsonResponse({ ok: true })
  }

  const inquiry = {
    firstName: cleanSingleLine(payload.firstName, limits.firstName),
    lastName: cleanSingleLine(payload.lastName, limits.lastName),
    email: cleanSingleLine(payload.email, limits.email),
    organization: cleanSingleLine(payload.organization, limits.organization),
    audience: cleanSingleLine(payload.audience, limits.audience),
    message: cleanField(payload.message, limits.message),
  }

  if (Object.values(inquiry).some(value => !value) || !isValidEmail(inquiry.email)) {
    return jsonResponse({ error: 'Please complete all required fields and check your email address.' }, 400)
  }

  if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_EMAIL_API_TOKEN) {
    console.error('Email Service credentials are not configured.')
    return jsonResponse({ error: 'The inquiry service is temporarily unavailable. Please email us directly.' }, 503)
  }

  const fullName = `${inquiry.firstName} ${inquiry.lastName}`
  const safe = Object.fromEntries(
    Object.entries(inquiry).map(([key, value]) => [key, escapeHtml(value)]),
  )

  let emailResponse
  try {
    emailResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CLOUDFLARE_EMAIL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: RECIPIENT_EMAIL,
          from: { email: SENDER_EMAIL, name: 'ANNUOTAI MEDTECH Website' },
          replyTo: { email: inquiry.email, name: fullName },
          subject: `Website inquiry from ${inquiry.organization}`,
          text: [
            'New website inquiry',
            '',
            `Name: ${fullName}`,
            `Email: ${inquiry.email}`,
            `Organization: ${inquiry.organization}`,
            `Audience: ${inquiry.audience}`,
            '',
            'Message:',
            inquiry.message,
          ].join('\n'),
          html: `
            <h1>New Website Inquiry</h1>
            <p><strong>Name:</strong> ${safe.firstName} ${safe.lastName}</p>
            <p><strong>Email:</strong> ${safe.email}</p>
            <p><strong>Organization:</strong> ${safe.organization}</p>
            <p><strong>Audience:</strong> ${safe.audience}</p>
            <h2>Message</h2>
            <p>${safe.message.replaceAll('\n', '<br>')}</p>
          `,
        }),
      },
    )
  } catch (error) {
    console.error('Cloudflare Email Service could not be reached:', error)
    return jsonResponse({ error: 'We could not send your inquiry. Please try again or email us directly.' }, 502)
  }

  if (!emailResponse.ok) {
    const details = await emailResponse.text()
    console.error('Cloudflare Email Service rejected the inquiry:', emailResponse.status, details)
    return jsonResponse({ error: 'We could not send your inquiry. Please try again or email us directly.' }, 502)
  }

  return jsonResponse({ ok: true })
}

export function onRequest() {
  return jsonResponse({ error: 'Method not allowed.' }, 405)
}
