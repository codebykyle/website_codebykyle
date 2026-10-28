<script setup lang="ts">
type Link = { label: string, href: string, external?: boolean }

defineProps<{
  brand: string
  tagline: string
  elsewhere: Link[]
  copyright: string
}>()
</script>

<template>
  <div class="footblock">
    <div class="foot-top">
      <div class="foot-brand">
        <div class="foot-brand-mark mono">
          {{ brand }}
        </div>
        <div class="foot-tagline">
          {{ tagline }}
        </div>
      </div>
      <nav class="foot-links">
        <a
          v-for="(l, i) in elsewhere"
          :key="i"
          class="foot-link mono"
          :href="l.href"
          :target="l.external ? '_blank' : undefined"
          :rel="l.external ? 'noopener' : undefined"
        >
          {{ l.label }}
        </a>
      </nav>
    </div>
    <div class="foot-bottom mono">
      {{ copyright }}
    </div>
  </div>
</template>
