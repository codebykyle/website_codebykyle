<script setup lang="ts">
const route = useRoute()

const [{ data: page }, { data: landing }] = await Promise.all([
  useAsyncData(`project-${route.path}`, () =>
    queryCollection('projects').path(route.path).first()
  ),
  useAsyncData('landing', () => queryCollection('landing').first())
])

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

useSeoMeta({
  title: `${page.value.title} · codebykyle`,
  description: page.value.blurb,
  ogTitle: page.value.title,
  ogDescription: page.value.blurb
})

const eyebrow = computed(() => {
  if (!page.value) return ''
  return [page.value.code, page.value.stat, page.value.sub].filter(Boolean).join(' · ')
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
        to="/#projects"
        class="page-back"
      >
        <UIcon name="i-lucide-arrow-left" />
        All projects
      </NuxtLink>

      <SiteSectionHeader
        :eyebrow="eyebrow"
        :title="page.title"
        :description="page.blurb"
        :color="page.color"
      />

      <div :class="['project-banner', `project-banner-${page.color}`]">
        <img
          :src="page.image"
          :alt="page.imageAlt"
          loading="eager"
        >
      </div>

      <a
        v-if="page.url"
        :href="page.url"
        target="_blank"
        rel="noopener"
        class="project-cta"
      >
        View on GitHub
        <UIcon
          name="i-lucide-external-link"
          class="cta-icon"
        />
      </a>

      <article class="prose">
        <ContentRenderer :value="page" />
      </article>

      <hr
        v-if="landing"
        class="end-divider"
        aria-hidden="true"
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
