import { queryCollection } from '@nuxt/content/nitro'

const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://codebykyle.com'
const SITE_TITLE = 'codebykyle'
const SITE_DESC = 'Notes on Odoo, small-business CRM/ERP, drones, CNC, and the small tools that come out of all of it.'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(date: string): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return new Date().toUTCString()
  return d.toUTCString()
}

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'blog').order('date', 'DESC').all()
  const lastBuild = posts[0] ? toRfc822(posts[0].date) : new Date().toUTCString()

  const items = posts.map(p => `
    <item>
      <title>${escapeXml(p.title ?? '')}</title>
      <link>${SITE_URL}${p.path}</link>
      <guid isPermaLink="true">${SITE_URL}${p.path}</guid>
      <pubDate>${toRfc822(p.date)}</pubDate>
      <category>${escapeXml(p.tag)}</category>
      <description>${escapeXml(p.blurb)}</description>
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=600, s-maxage=3600')
  return xml
})
