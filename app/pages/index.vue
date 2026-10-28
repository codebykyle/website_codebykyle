<script lang="ts" setup>
import '~/assets/css/site.css'

const [{ data: landing }, { data: posts }, { data: projects }, { data: repositories }, { data: tools }, { data: links }] = await Promise.all([
  useAsyncData('landing', () => queryCollection('landing').first()),
  useAsyncData('posts', () => queryCollection('blog').order('order', 'ASC').all()),
  useAsyncData('projects', () => queryCollection('projects').order('order', 'ASC').all()),
  useAsyncData('repositories', () => queryCollection('repositories').order('order', 'ASC').all()),
  useAsyncData('tools', () => queryCollection('tools').order('order', 'ASC').all()),
  useAsyncData('links', () => queryCollection('links').order('order', 'ASC').all())
])

if (!landing.value) {
  throw createError({ statusCode: 404, statusMessage: 'Landing not found', fatal: true })
}

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,wght@1,400;1,500&display=swap'
    }
  ]
})

useSeoMeta({
  title: landing.value.seo.title,
  ogTitle: landing.value.seo.title,
  description: landing.value.seo.description,
  ogDescription: landing.value.seo.description
})

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  inViewOptions: { once: true, margin: '-10% 0px' as const },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
}

// Blog topic filter: drives both Topics chips and the BlogList items.
const activeTag = ref<string | null>(null)
const filteredPosts = computed(() => {
  const all = posts.value ?? []
  if (!activeTag.value) return all
  const t = activeTag.value.toLowerCase()
  return all.filter(p => p.tag.toLowerCase() === t)
})
</script>

<template>
  <div v-if="landing">
    <SiteHero
      :sub="landing.hero.sub"
      :title="landing.hero.title"
    />

    <div class="frame">
      <Motion
        id="about"
        as="section"
        class="section"
        v-bind="reveal"
      >
        <SiteSectionHeader v-bind="landing.sections.about" />
        <SiteAbout v-bind="landing.about" />
        <SiteCallout v-bind="landing.callouts.adomi" />
      </Motion>

      <Motion
        id="newsletter"
        as="section"
        class="section"
        v-bind="reveal"
      >
        <SiteSectionHeader v-bind="landing.sections.newsletter" />
        <SiteNewsletter v-bind="landing.newsletter" />
      </Motion>

      <Motion
        v-if="posts?.length"
        id="blog"
        as="section"
        class="section"
        v-bind="reveal"
      >
        <SiteSectionHeader v-bind="landing.sections.fieldNotes" />
        <SiteTopics
          :active="activeTag"
          :items="landing.topics.items"
          @update:active="activeTag = $event"
        />
        <SiteBlogList
          :page-size="5"
          :posts="filteredPosts"
        />
      </Motion>

      <Motion
        v-if="projects?.length"
        id="projects"
        as="section"
        class="section"
        v-bind="reveal"
      >
        <SiteSectionHeader v-bind="landing.sections.workshop" />
        <SiteCallout v-bind="landing.callouts.contact" />
        <SiteProjectList
          :page-size="6"
          :projects="projects ?? []"
        />
      </Motion>

      <Motion
        v-if="repositories?.length"
        id="repositories"
        as="section"
        class="section"
        v-bind="reveal"
      >
        <SiteSectionHeader v-bind="landing.sections.repositories" />
        <SiteCallout v-bind="landing.callouts.adomi" />
        <SiteCardGrid
          :items="repositories ?? []"
          meta="github · open source"
          cta-label="View on GitHub"
        />
      </Motion>

      <Motion
        v-if="tools?.length"
        id="tools"
        as="section"
        class="section"
        v-bind="reveal"
      >
        <SiteSectionHeader v-bind="landing.sections.tools" />
        <SiteCardGrid
          :items="tools ?? []"
          meta="browser tool"
          cta-label="Open"
        />
      </Motion>

      <Motion
        v-if="links?.length"
        id="links"
        as="section"
        class="section"
        v-bind="reveal"
      >
        <SiteSectionHeader v-bind="landing.sections.links" />
        <SiteCardGrid
          :items="links ?? []"
          meta="link"
          cta-label="Visit"
        />
      </Motion>

      <Motion
        id="contact"
        as="section"
        class="section"
        v-bind="reveal"
      >
        <SiteSectionHeader v-bind="landing.sections.contact" />
        <SiteContact v-bind="landing.contact" />
      </Motion>

      <Motion
        as="div"
        v-bind="reveal"
      >
        <SiteFooter v-bind="landing.footblock" />
      </Motion>
    </div>
  </div>
</template>
