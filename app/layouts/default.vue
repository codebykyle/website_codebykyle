<script setup lang="ts">
useHead({
  bodyAttrs: { class: 'site-shell' }
})
</script>

<template>
  <div class="site">
    <SiteNav />
    <slot />
  </div>
</template>
