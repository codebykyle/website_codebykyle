type NewsletterBody = {
  email?: unknown
  // honeypot, real users won't fill this
  company?: unknown
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAILERLITE_API = 'https://connect.mailerlite.com/api'

let cachedGroupId: string | null = null

async function resolveGroupId(apiKey: string, groupName: string): Promise<string> {
  if (cachedGroupId) return cachedGroupId

  const res = await $fetch<{ data: { id: string, name: string }[] }>(
    `${MAILERLITE_API}/groups`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json'
      },
      query: { 'filter[name]': groupName, 'limit': 100 }
    }
  )

  const match = res.data.find(g => g.name === groupName)
  if (!match) {
    throw createError({
      statusCode: 500,
      statusMessage: `MailerLite group "${groupName}" not found.`
    })
  }

  cachedGroupId = match.id
  return match.id
}

export default defineEventHandler(async (event) => {
  const body = await readBody<NewsletterBody>(event)

  if (typeof body?.company === 'string' && body.company.trim().length > 0) {
    return { ok: true }
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    throw createError({ statusCode: 400, statusMessage: 'A valid email is required.' })
  }

  const cfg = useRuntimeConfig(event)
  const apiKey = cfg.mailerliteApiKey
  const groupName = cfg.mailerliteGroup || 'codebykyle'

  if (!apiKey) {
    console.log('[newsletter] no MAILERLITE_API_KEY configured; signup logged:', { email })
    return { ok: true }
  }

  const groupId = await resolveGroupId(apiKey, groupName)

  await $fetch(`${MAILERLITE_API}/subscribers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: { email, groups: [groupId] }
  })

  return { ok: true }
})
