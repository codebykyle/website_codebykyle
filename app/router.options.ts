import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    const nuxtApp = useNuxtApp()

    return new Promise((resolve) => {
      // Wait until the new page has actually rendered before deciding where
      // to scroll. Without this the anchor target may not exist yet (for
      // hash links) and a fresh page may still have the previous page's
      // height (so `top: 0` lands you nowhere useful).
      nuxtApp.hooks.hookOnce('page:finish', () => {
        // Browser back / forward → restore.
        if (savedPosition) {
          resolve(savedPosition)
          return
        }
        // Hash anchor → scroll to that element with an offset for the fixed nav.
        if (to.hash) {
          const el = document.querySelector(to.hash)
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80
            resolve({ left: 0, top, behavior: 'smooth' })
          } else {
            resolve({ left: 0, top: 0 })
          }
          return
        }
        // New page → top.
        resolve({ left: 0, top: 0 })
      })
    })
  }
}
