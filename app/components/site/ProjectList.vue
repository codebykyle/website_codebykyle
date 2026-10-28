<script setup lang="ts">
type Project = {
  path: string
  code: string
  title: string
  blurb: string
  stat: string
  sub: string
  image: string
  imageAlt: string
  color?: 'indigo' | 'pink' | 'teal' | 'orange' | 'green' | 'purple'
}

const props = defineProps<{
  projects: Project[]
  pageSize?: number
}>()

const pageSize = computed(() => props.pageSize ?? 6)
const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(props.projects.length / pageSize.value)))

watch(() => props.projects, () => {
  page.value = 1
})
watch(totalPages, (t) => {
  if (page.value > t) page.value = t
})

const pagedProjects = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return props.projects.slice(start, start + pageSize.value)
})

function go(p: number) {
  page.value = Math.max(1, Math.min(totalPages.value, p))
}
</script>

<template>
  <div>
    <div class="card-grid">
      <NuxtLink
        v-for="(p, i) in pagedProjects"
        :key="i"
        :to="p.path"
        :class="['card-tile', `card-tile-${p.color || 'indigo'}`]"
      >
        <div class="card-tile-vis">
          <img
            :src="p.image"
            :alt="p.imageAlt"
            loading="lazy"
          >
        </div>
        <div class="card-tile-body">
          <div class="card-tile-meta mono">
            <span class="stat">{{ p.stat }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ p.sub }}</span>
          </div>
          <h3 class="card-tile-title grotesk">
            {{ p.title }}
          </h3>
          <p class="card-tile-sub">
            {{ p.blurb }}
          </p>
          <div class="card-tile-arrow">
            View project
            <UIcon name="i-lucide-arrow-right" />
          </div>
        </div>
      </NuxtLink>
    </div>

    <nav
      v-if="totalPages > 1"
      class="pagination"
      aria-label="Pagination"
    >
      <button
        type="button"
        class="page-btn"
        :disabled="page === 1"
        @click="go(page - 1)"
      >
        ← Previous
      </button>
      <button
        v-for="p in totalPages"
        :key="p"
        type="button"
        :class="['page-btn', 'page-btn-num', { 'is-active': page === p }]"
        :aria-current="page === p ? 'page' : undefined"
        @click="go(p)"
      >
        {{ p }}
      </button>
      <button
        type="button"
        class="page-btn"
        :disabled="page === totalPages"
        @click="go(page + 1)"
      >
        Next →
      </button>
    </nav>
  </div>
</template>
