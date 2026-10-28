<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
  color?: 'indigo' | 'pink' | 'teal' | 'orange' | 'green' | 'purple'
}>()
</script>

<template>
  <header :class="['section-header', `section-header-${color || 'indigo'}`]">
    <div class="section-header-text">
      <p
        v-if="eyebrow"
        class="section-eyebrow"
      >
        {{ eyebrow }}
      </p>
      <h2 class="section-title grotesk">
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="section-description"
      >
        {{ description }}
      </p>
    </div>
  </header>
</template>
