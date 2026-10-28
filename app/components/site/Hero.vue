<script setup lang="ts">
type TitleSeg = { text: string, kind?: 'plain' | 'at' | 'cyan' | 'hand' }

const props = defineProps<{
  title: TitleSeg[]
  sub: string
}>()

// Drop a looping clip into public/hero/ to swap the banner art.
const heroVideo = '/hero/hero.mp4'
const heroPoster = '/hero/hero-poster.jpg'

const totalChars = computed(() => {
  let n = 0
  for (const seg of props.title) {
    if (seg.text === '\n') n += 1
    else n += [...seg.text].length
  }
  return n
})

// Start fully revealed so SSR HTML matches the initial client render (no
// hydration mismatch). onMounted resets to 0 and runs the typing animation.
const revealed = ref(totalChars.value)
const started = ref(false)
const isTyping = computed(() => started.value && revealed.value < totalChars.value)

const visibleSegments = computed(() => {
  type Out = TitleSeg | { kind: 'br' }
  const out: Out[] = []
  let consumed = 0
  for (const seg of props.title) {
    if (consumed >= revealed.value) break
    if (seg.text === '\n') {
      out.push({ kind: 'br' })
      consumed += 1
      continue
    }
    const segChars = [...seg.text]
    const take = Math.min(segChars.length, revealed.value - consumed)
    if (take === segChars.length) {
      out.push(seg)
    } else {
      out.push({ ...seg, text: segChars.slice(0, take).join('') })
    }
    consumed += take
  }
  return out
})

const subParts = computed(() => {
  const parts: { text: string, bold: boolean }[] = []
  const re = /\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(props.sub)) !== null) {
    if (m.index > last) parts.push({ text: props.sub.slice(last, m.index), bold: false })
    parts.push({ text: m[1] || '', bold: true })
    last = m.index + m[0].length
  }
  if (last < props.sub.length) parts.push({ text: props.sub.slice(last), bold: false })
  return parts
})

let timer: ReturnType<typeof setTimeout> | null = null

function charAt(index: number): { ch: string, isBr: boolean } | null {
  let consumed = 0
  for (const seg of props.title) {
    if (seg.text === '\n') {
      if (consumed === index) return { ch: '\n', isBr: true }
      consumed += 1
      continue
    }
    const segChars = [...seg.text]
    if (index < consumed + segChars.length) {
      return { ch: segChars[index - consumed]!, isBr: false }
    }
    consumed += segChars.length
  }
  return null
}

function typeNext() {
  if (revealed.value >= totalChars.value) return
  revealed.value += 1
  const last = charAt(revealed.value - 1)
  let delay = 38 + Math.random() * 42
  if (last) {
    if (last.isBr) delay = 320
    else if (last.ch === '.') delay = 340
    else if (last.ch === ',' || last.ch === ';' || last.ch === ':') delay = 200
    else if (last.ch === '!' || last.ch === '?') delay = 300
    else if (last.ch === ' ') delay = 60
  }
  timer = setTimeout(typeNext, delay)
}

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  revealed.value = 0
  started.value = true
  // Wait for the hero's fade-up entrance to settle before typing starts.
  timer = setTimeout(typeNext, 950)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <section class="hero">
    <video
      class="hero-video"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      :poster="heroPoster"
      aria-hidden="true"
    >
      <source
        :src="heroVideo"
        type="video/mp4"
      >
    </video>
    <div
      class="hero-overlay"
      aria-hidden="true"
    />
    <div class="hero-inner">
      <Motion
        :initial="{ opacity: 0, y: 14 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }"
      >
        <h1
          class="grotesk h1-stack"
          :class="{ 'is-typing': isTyping }"
        >
          <span
            class="h1-ghost"
            aria-hidden="true"
          >
            <template
              v-for="(seg, i) in title"
              :key="i"
            >
              <br v-if="seg.text === '\n'">
              <span
                v-else-if="seg.kind === 'at'"
                class="at"
              >{{ seg.text }}</span>
              <span
                v-else-if="seg.kind === 'cyan'"
                style="color: var(--site-cyan);"
              >{{ seg.text }}</span>
              <span
                v-else-if="seg.kind === 'hand'"
                class="hand"
              >{{ seg.text }}</span>
              <template v-else>{{ seg.text }}</template>
            </template>
          </span>
          <span class="h1-visible">
            <template
              v-for="(seg, i) in visibleSegments"
              :key="i"
            >
              <br v-if="seg.kind === 'br'">
              <span
                v-else-if="seg.kind === 'at'"
                class="at"
              >{{ seg.text }}</span>
              <span
                v-else-if="seg.kind === 'cyan'"
                style="color: var(--site-cyan);"
              >{{ seg.text }}</span>
              <span
                v-else-if="seg.kind === 'hand'"
                class="hand"
              >{{ seg.text }}</span>
              <template v-else>{{ seg.text }}</template>
            </template><span
              class="caret"
              aria-hidden="true"
            />
          </span>
        </h1>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }"
      >
        <p class="sub">
          <template
            v-for="(p, i) in subParts"
            :key="i"
          >
            <b v-if="p.bold">{{ p.text }}</b>
            <template v-else>
              {{ p.text }}
            </template>
          </template>
        </p>
      </Motion>
    </div>
  </section>
</template>
