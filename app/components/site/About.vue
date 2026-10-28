<script setup lang="ts">
type Highlight = { label: string, value: string }

const props = defineProps<{
  headline: string
  body: string
  highlights: Highlight[]
}>()

// Tiny inline markdown for **bold** (matches what Hero does for its sub).
const bodyParts = computed(() => {
  const parts: { text: string, bold: boolean }[] = []
  const re = /\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(props.body)) !== null) {
    if (m.index > last) parts.push({ text: props.body.slice(last, m.index), bold: false })
    parts.push({ text: m[1] || '', bold: true })
    last = m.index + m[0].length
  }
  if (last < props.body.length) parts.push({ text: props.body.slice(last), bold: false })
  return parts
})
</script>

<template>
  <div class="about">
    <div class="about-shapes">
      <span class="shape shape-1" />
      <span class="shape shape-2" />
      <span class="shape shape-3" />
    </div>
    <div class="about-body">
      <h3 class="about-headline grotesk">
        {{ headline }}
      </h3>
      <p class="about-text">
        <template
          v-for="(p, i) in bodyParts"
          :key="i"
        >
          <strong v-if="p.bold">{{ p.text }}</strong>
          <template v-else>
            {{ p.text }}
          </template>
        </template>
      </p>
      <dl class="about-highlights">
        <div
          v-for="(h, i) in highlights"
          :key="i"
          class="highlight"
        >
          <dt>{{ h.label }}</dt>
          <dd>{{ h.value }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
