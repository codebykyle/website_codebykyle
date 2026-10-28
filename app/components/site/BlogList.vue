<script setup lang="ts">
type Post = {
  path: string
  title: string
  date: string
  tag: string
  blurb: string
}

const props = defineProps<{
  posts: Post[]
  pageSize?: number
}>()

const TAG_STYLE: Record<string, { color: string, image: string }> = {
  odoo: { color: 'indigo', image: '/projects/odoo.svg' },
  drones: { color: 'pink', image: '/projects/drone.svg' },
  cnc: { color: 'teal', image: '/projects/cnc.svg' },
  web: { color: 'green', image: '/projects/dotfiles.svg' }
}
function styleFor(tag: string) {
  return TAG_STYLE[tag.toLowerCase()] ?? { color: 'purple', image: '/projects/webstudio.svg' }
}

function formatDate(d: string) {
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return d
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const pageSize = computed(() => props.pageSize ?? 5)
const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(props.posts.length / pageSize.value)))

watch(() => props.posts, () => {
  page.value = 1
})
watch(totalPages, (t) => {
  if (page.value > t) page.value = t
})

const pagedPosts = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return props.posts.slice(start, start + pageSize.value)
})

function go(p: number) {
  page.value = Math.max(1, Math.min(totalPages.value, p))
}
</script>

<template>
  <div>
    <div
      v-if="!posts.length"
      class="empty-state"
    >
      No posts on this topic yet, check back soon.
    </div>
    <div
      v-else
      class="entry-list"
    >
      <NuxtLink
        v-for="(p, i) in pagedPosts"
        :key="i"
        :to="p.path"
        :class="['entry', `entry-${styleFor(p.tag).color}`]"
      >
        <div class="entry-image">
          <img
            :src="styleFor(p.tag).image"
            :alt="`Cover for ${p.title}`"
            loading="lazy"
          >
        </div>
        <div class="entry-content">
          <div class="entry-meta mono">
            <span>{{ formatDate(p.date) }}</span>
            <span aria-hidden="true">·</span>
            <span class="entry-tag">{{ p.tag.toLowerCase() }}</span>
          </div>
          <h3 class="entry-title grotesk">
            {{ p.title }}
          </h3>
          <p class="entry-blurb">
            {{ p.blurb }}
          </p>
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
