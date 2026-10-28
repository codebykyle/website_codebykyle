<script lang="ts" setup>
const route = useRoute()

const [{ data: page }, { data: surround }, { data: landing }] = await Promise.all([
  useAsyncData(`blog-${route.path}`, () =>
    queryCollection('blog').path(route.path).first()
  ),
  useAsyncData(`blog-surround-${route.path}`, () =>
    queryCollectionItemSurroundings('blog', route.path)
  ),
  useAsyncData('landing', () => queryCollection('landing').first())
])

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useSeoMeta({
  title: `${page.value.title} · codebykyle`,
  description: page.value.blurb,
  ogTitle: page.value.title,
  ogDescription: page.value.blurb
})

const TAG_COLOR: Record<string, 'indigo' | 'pink' | 'teal' | 'orange' | 'green' | 'purple'> = {
  odoo: 'indigo',
  drones: 'pink',
  cnc: 'teal',
  web: 'green'
}
const tagColor = computed(() => {
  if (!page.value) return 'indigo'
  return TAG_COLOR[page.value.tag.toLowerCase()] ?? 'purple'
})

function formatDate(d: string) {
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return d
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const eyebrow = computed(() => {
  if (!page.value) return ''
  const parts = [formatDate(page.value.date), page.value.tag]
  if (page.value.minRead) parts.push(`${page.value.minRead} min read`)
  return parts.join(' · ')
})

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  inViewOptions: { once: true, margin: '-10% 0px' as const },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
}
</script>

<template>
  <main
    v-if="page"
    class="page"
  >
    <div class="page-frame page-frame-narrow">
      <NuxtLink
        class="page-back"
        to="/#blog"
      >
        <UIcon name="i-lucide-arrow-left" />
        All posts
      </NuxtLink>

      <SiteSectionHeader
        :color="tagColor"
        :description="page.blurb"
        :eyebrow="eyebrow"
        :title="page.title"
      />

      <article class="prose">
        <ContentRenderer :value="page" />
      </article>

      <nav
        v-if="surround && (surround[0] || surround[1])"
        aria-label="More posts"
        class="post-surround"
      >
        <NuxtLink
          v-if="surround[0]"
          :to="surround[0].path"
          class="surround-link surround-prev"
        >
          <span class="surround-label">← Previous</span>
          <span class="surround-title">{{ surround[0].title }}</span>
        </NuxtLink>
        <NuxtLink
          v-if="surround[1]"
          :to="surround[1].path"
          class="surround-link surround-next"
        >
          <span class="surround-label">Next →</span>
          <span class="surround-title">{{ surround[1].title }}</span>
        </NuxtLink>
      </nav>

      <hr
        v-if="landing"
        aria-hidden="true"
        class="end-divider"
      >

      <Motion
        v-if="landing"
        as="section"
        class="section"
        v-bind="reveal"
      >
        <SiteSectionHeader v-bind="landing.sections.about" />
        <SiteAbout v-bind="landing.about" />
        <SiteCallout v-bind="landing.callouts.adomi" />
      </Motion>

      <Motion
        v-if="landing"
        id="contact"
        as="section"
        class="section"
        v-bind="reveal"
      >
        <SiteSectionHeader v-bind="landing.sections.contact" />
        <SiteContact v-bind="landing.contact" />
      </Motion>
    </div>
  </main>
</template>
