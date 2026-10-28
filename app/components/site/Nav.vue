<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

// On the home page, the nav floats over the dark video hero until you
// scroll past it. On every other page there's no hero, so it should look
// "scrolled" from the start.
const navState = computed(() => !isHome.value || scrolled.value)

// Sections with no entries are hidden on the home page, so their links go too.
const { data: counts } = await useAsyncData('nav-counts', async () => {
  const [blog, projects, repositories, tools, links] = await Promise.all([
    queryCollection('blog').count(),
    queryCollection('projects').count(),
    queryCollection('repositories').count(),
    queryCollection('tools').count(),
    queryCollection('links').count()
  ])
  return { blog, projects, repositories, tools, links }
})

// On the home page these are anchor jumps; on inner pages they need to
// take you back to the home page first, then jump to the section.
const links = computed(() => {
  const home = isHome.value ? '' : '/'
  const c = counts.value
  return [
    { label: 'Home', href: '/' },
    { label: 'About', href: `${home}#about` },
    { label: 'Blog', href: `${home}#blog`, show: c?.blog },
    { label: 'Projects', href: `${home}#projects`, show: c?.projects },
    { label: 'Repositories', href: `${home}#repositories`, show: c?.repositories },
    { label: 'Tools', href: `${home}#tools`, show: c?.tools },
    { label: 'Links', href: `${home}#links`, show: c?.links },
    { label: 'Contact', href: `${home}#contact` }
  ].filter(l => l.show === undefined || l.show > 0)
})

// Clicking the logo or the Home link while already on / should smooth-scroll
// to the top instead of being a no-op (the router doesn't fire scrollBehavior
// for same-route navigations).
function onHomeClick(e: MouseEvent) {
  if (!isHome.value) return
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const icons = [
  { label: 'codebykyle on GitHub', href: 'https://github.com/codebykyle', icon: 'i-simple-icons-github', external: true },
  { label: 'RSS feed', href: '/rss.xml', icon: 'i-lucide-rss', external: false }
]
</script>

<template>
  <header :class="['nav', { 'is-scrolled': navState }]">
    <div class="nav-inner">
      <NuxtLink
        to="/"
        class="nav-logo"
        aria-label="codebykyle home"
        @click="onHomeClick"
      >
        <span
          class="nav-logo-mark"
          aria-hidden="true"
        >CK</span>
        <span class="nav-logo-text">codebykyle</span>
      </NuxtLink>
      <nav
        class="nav-links"
        aria-label="Primary"
      >
        <a
          v-for="l in links"
          :key="l.href"
          :href="l.href"
          class="nav-link"
          @click="l.label === 'Home' ? onHomeClick($event) : undefined"
        >
          {{ l.label }}
        </a>
        <span
          class="nav-divider"
          aria-hidden="true"
        />
        <a
          v-for="i in icons"
          :key="i.href"
          :href="i.href"
          :target="i.external ? '_blank' : undefined"
          :rel="i.external ? 'noopener' : undefined"
          class="nav-icon-link"
          :aria-label="i.label"
        >
          <UIcon
            :name="i.icon"
            class="nav-icon"
          />
        </a>
      </nav>
    </div>
  </header>
</template>
