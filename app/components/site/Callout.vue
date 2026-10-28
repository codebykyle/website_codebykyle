<script setup lang="ts">
defineProps<{
  eyebrow?: string
  headline: string
  body?: string
  ctaLabel: string
  ctaHref: string
  external?: boolean
  color?: 'indigo' | 'pink' | 'teal' | 'orange' | 'green' | 'purple'
}>()
</script>

<template>
  <component
    :is="external ? 'a' : (ctaHref.startsWith('#') ? 'a' : resolveComponent('NuxtLink'))"
    :to="!external && !ctaHref.startsWith('#') ? ctaHref : undefined"
    :href="external || ctaHref.startsWith('#') ? ctaHref : undefined"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="['callout', `callout-${color || 'indigo'}`]"
  >
    <div class="callout-content">
      <p
        v-if="eyebrow"
        class="callout-eyebrow"
      >
        {{ eyebrow }}
      </p>
      <h3 class="callout-headline grotesk">
        {{ headline }}
      </h3>
      <p
        v-if="body"
        class="callout-body"
      >
        {{ body }}
      </p>
      <span class="callout-cta">
        {{ ctaLabel }}
        <UIcon
          :name="external ? 'i-lucide-external-link' : 'i-lucide-arrow-right'"
          class="callout-icon"
        />
      </span>
    </div>
    <div
      class="callout-decoration"
      aria-hidden="true"
    >
      <span class="shape shape-1" />
      <span class="shape shape-2" />
      <span class="shape shape-3" />
      <span class="shape shape-dot" />
    </div>
  </component>
</template>
