import nodemailer from 'nodemailer'

type ContactBody = {
  name?: unknown
  email?: unknown
  message?: unknown
  // honeypot, real users won't fill this
  company?: unknown
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event)

  // Honeypot: silently succeed for bots
  if (typeof body?.company === 'string' && body.company.trim().length > 0) {
    return { ok: true }
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''

  if (!name || name.length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required (max 120 chars).' })
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    throw createError({ statusCode: 400, statusMessage: 'A valid email is required.' })
  }
  if (!message || message.length > 5000) {
    throw createError({ statusCode: 400, statusMessage: 'Message is required (max 5000 chars).' })
  }

  const cfg = useRuntimeConfig(event)
  const to = cfg.contactTo
  if (!to) {
    throw createError({ statusCode: 500, statusMessage: 'Contact recipient is not configured.' })
  }

  // No SMTP host configured. Log and return ok so local dev works without
  // setting up a mail provider.
  if (!cfg.smtpHost) {
    console.log('[contact] no SMTP configured; message logged:', { name, email, message })
    return { ok: true }
  }

  const port = Number(cfg.smtpPort) || 587
  const secure = cfg.smtpSecure === 'true' || port === 465

  const transporter = nodemailer.createTransport({
    host: cfg.smtpHost,
    port,
    secure,
    auth: cfg.smtpUser ? { user: cfg.smtpUser, pass: cfg.smtpPass } : undefined
  })

  const fromAddress = cfg.contactFrom || cfg.smtpUser || to

  await transporter.sendMail({
    from: { name: 'codebykyle.com contact form', address: fromAddress },
    to,
    replyTo: { name, address: email },
    subject: `New contact form message from ${name}`,
    text: `${message}\n\n-- Sent via codebykyle.com contact form\nFrom: ${name} <${email}>`
  })

  return { ok: true }
})
