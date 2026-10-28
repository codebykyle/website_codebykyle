<script setup lang="ts">
defineProps<{
  eyebrow?: string
  headline: string
  body: string
  namePlaceholder: string
  emailPlaceholder: string
  messagePlaceholder: string
  buttonLabel: string
  sendingLabel: string
  successHeadline: string
  successBody: string
  errorFallback: string
  color?: 'indigo' | 'pink' | 'teal' | 'orange' | 'green' | 'purple'
}>()

type Status = 'idle' | 'sending' | 'success' | 'error'

const name = ref('')
const email = ref('')
const message = ref('')
const company = ref('') // honeypot
const status = ref<Status>('idle')
const errorMessage = ref('')

async function submit(e: Event) {
  e.preventDefault()
  if (status.value === 'sending') return
  status.value = 'sending'
  errorMessage.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        message: message.value,
        company: company.value
      }
    })
    status.value = 'success'
  } catch (err: unknown) {
    status.value = 'error'
    const e = err as { data?: { statusMessage?: string }, statusMessage?: string }
    errorMessage.value = e?.data?.statusMessage || e?.statusMessage || ''
  }
}
</script>

<template>
  <div :class="['contact', `contact-${color || 'teal'}`]">
    <div
      class="contact-decoration"
      aria-hidden="true"
    >
      <span class="shape shape-1" />
      <span class="shape shape-2" />
      <span class="shape shape-3" />
      <span class="shape shape-dot" />
    </div>

    <div class="contact-text">
      <p
        v-if="eyebrow"
        class="contact-eyebrow"
      >
        {{ eyebrow }}
      </p>
      <h3 class="contact-headline grotesk">
        {{ headline }}
      </h3>
      <p class="contact-body">
        {{ body }}
      </p>
    </div>

    <div class="contact-form-wrap">
      <div
        v-if="status === 'success'"
        class="contact-ack"
      >
        <div class="ack-headline">
          {{ successHeadline }}
        </div>
        <div class="ack-body">
          {{ successBody }}
        </div>
      </div>
      <form
        v-else
        class="contact-form"
        novalidate
        @submit="submit"
      >
        <label class="field">
          <span class="field-label">Name</span>
          <input
            v-model="name"
            type="text"
            :placeholder="namePlaceholder"
            required
            maxlength="120"
            autocomplete="name"
            :disabled="status === 'sending'"
          >
        </label>
        <label class="field">
          <span class="field-label">Email</span>
          <input
            v-model="email"
            type="email"
            :placeholder="emailPlaceholder"
            required
            maxlength="254"
            autocomplete="email"
            :disabled="status === 'sending'"
          >
        </label>
        <label class="field">
          <span class="field-label">Message</span>
          <textarea
            v-model="message"
            rows="5"
            :placeholder="messagePlaceholder"
            required
            maxlength="5000"
            :disabled="status === 'sending'"
          />
        </label>
        <input
          v-model="company"
          type="text"
          tabindex="-1"
          autocomplete="off"
          class="hp"
          aria-hidden="true"
        >
        <div class="form-row">
          <button
            type="submit"
            :disabled="status === 'sending'"
          >
            {{ status === 'sending' ? sendingLabel : buttonLabel }}
          </button>
          <span
            v-if="status === 'error'"
            class="form-error"
          >{{ errorMessage || errorFallback }}</span>
        </div>
      </form>
    </div>
  </div>
</template>
