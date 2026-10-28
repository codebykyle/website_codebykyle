<script setup lang="ts">
type Topic = {
  name: string
  tag: string
  color: 'indigo' | 'pink' | 'teal' | 'orange' | 'green' | 'purple'
}

const props = defineProps<{
  items: Topic[]
  active?: string | null
  allLabel?: string
}>()

const emit = defineEmits<{
  (e: 'update:active', tag: string | null): void
}>()

function select(tag: string | null) {
  // Clicking the active chip clears the filter.
  emit('update:active', tag === props.active ? null : tag)
}
</script>

<template>
  <div
    class="topics topics-filterable"
    role="group"
    aria-label="Filter posts by topic"
  >
    <button
      type="button"
      :class="['topic', 'topic-all', { 'topic-active': !active }]"
      :aria-pressed="!active"
      @click="select(null)"
    >
      {{ allLabel || 'All' }}
    </button>
    <button
      v-for="(t, i) in items"
      :key="i"
      type="button"
      :class="['topic', `topic-${t.color}`, { 'topic-active': active === t.tag }]"
      :aria-pressed="active === t.tag"
      @click="select(t.tag)"
    >
      {{ t.name }}
    </button>
  </div>
</template>
