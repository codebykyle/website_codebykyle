<script setup lang="ts">
const props = defineProps<{
  eyebrow?: string
  headlinePre: string
  headlineHand: string
  headlinePost: string
  body: string
  rssHref: string
  placeholder: string
  buttonLabel: string
  fineprint: string
  confirmation: string
}>()

const email = ref('')
const submitted = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

async function submit(e: Event) {
  e.preventDefault()
  if (!email.value || submitting.value) return

  submitting.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/newsletter', {
      method: 'POST',
      body: { email: email.value }
    })
    submitted.value = true
  } catch (err) {
    const fallback = 'Something went wrong. Try again in a moment.'
    errorMessage.value = (err as { statusMessage?: string })?.statusMessage || fallback
  } finally {
    submitting.value = false
  }
}

const confirmationParts = computed(() => {
  const i = props.confirmation.indexOf('.')
  if (i < 0) return { lead: props.confirmation, rest: '' }
  return { lead: props.confirmation.slice(0, i + 1), rest: props.confirmation.slice(i + 1).trim() }
})
</script>

<template>
  <div class="news">
    <div>
      <h3 class="grotesk">
        {{ headlinePre }}<span class="hand">{{ headlineHand }}</span>{{ headlinePost }}
      </h3>
      <p>
        {{ body }}
        <a
          :href="rssHref"
          class="rss"
        >RSS</a>.
      </p>
    </div>
    <div>
      <div
        v-if="submitted"
        class="ack"
      >
        {{ confirmationParts.lead }} <span>{{ confirmationParts.rest }}</span>
      </div>
      <template v-else>
        <form @submit="submit">
          <input
            v-model="email"
            type="email"
            required
            :placeholder="placeholder"
            :disabled="submitting"
          >
          <button
            type="submit"
            :disabled="submitting"
          >
            {{ buttonLabel }}
          </button>
        </form>
        <div
          v-if="errorMessage"
          class="small mono"
          style="color: var(--site-accent);"
        >
          {{ errorMessage }}
        </div>
        <div
          v-else
          class="small mono"
        >
          {{ fineprint }}
        </div>
      </template>
    </div>
  </div>
</template>
