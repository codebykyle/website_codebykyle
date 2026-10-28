<script setup lang="ts">
type Item = {
  name: string
  sub: string
  url: string
  image: string
}

withDefaults(defineProps<{
  items: Item[]
  meta?: string
  ctaLabel?: string
}>(), {
  meta: 'open source',
  ctaLabel: 'Visit'
})

const COLORS = ['indigo', 'pink', 'teal', 'orange', 'green', 'purple'] as const
function colorFor(i: number) {
  return COLORS[i % COLORS.length]
}
</script>

<template>
  <div class="card-grid">
    <a
      v-for="(t, i) in items"
      :key="i"
      :href="t.url"
      target="_blank"
      rel="noopener noreferrer"
      :class="['card-tile', `card-tile-${colorFor(i)}`]"
    >
      <div class="card-tile-vis">
        <img
          :src="t.image"
          :alt="`${t.name} preview`"
          loading="lazy"
        >
      </div>
      <div class="card-tile-body">
        <div class="card-tile-meta mono">
          <span>{{ meta }}</span>
        </div>
        <h3 class="card-tile-title grotesk">
          {{ t.name }}
        </h3>
        <p class="card-tile-sub">
          {{ t.sub }}
        </p>
        <div class="card-tile-arrow">
          {{ ctaLabel }}
          <UIcon name="i-lucide-external-link" />
        </div>
      </div>
    </a>
  </div>
</template>
