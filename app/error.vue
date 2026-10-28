<script setup lang="ts">
import '~/assets/css/site.css'
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useHead({
  bodyAttrs: { class: 'site-shell' },
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
  title: `${props.error.statusCode || ''} · codebykyle`,
  description: 'Something went off the rails.'
})

function handleHome() {
  clearError({ redirect: '/' })
}

const eyebrow = computed(() => {
  const code = props.error?.statusCode
  if (code === 404) return 'Error · 404'
  if (code) return `Error · ${code}`
  return 'Error'
})
const title = computed(() => {
  if (props.error?.statusCode === 404) return 'This page wandered off.'
  return props.error?.message || 'Something broke.'
})
const body = computed(() => {
  if (props.error?.statusCode === 404) {
    return 'The page you were looking for is not here. It may have moved, the link might be wrong, or it never existed in the first place. Head back to the homepage and try a different door.'
  }
  return 'An unexpected error happened. Try again, head home, or send a quick note via the contact form so I can fix it.'
})
</script>

<template>
  <div class="site">
    <SiteNav />
    <main class="page">
      <div class="page-frame page-frame-narrow">
        <SiteSectionHeader
          :eyebrow="eyebrow"
          :title="title"
          :description="body"
          color="pink"
        />

        <div class="error-actions">
          <button
            type="button"
            class="error-btn error-btn-primary"
            @click="handleHome"
          >
            <UIcon name="i-lucide-home" />
            Back home
          </button>
          <NuxtLink
            to="/#contact"
            class="error-btn"
          >
            <UIcon name="i-lucide-mail" />
            Get in touch
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>
