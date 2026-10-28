import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'data',
      source: 'landing.yml',
      schema: z.object({
        seo: z.object({
          title: z.string(),
          description: z.string()
        }),
        hero: z.object({
          title: z.array(z.object({
            text: z.string(),
            kind: z.enum(['plain', 'at', 'cyan', 'hand']).optional()
          })),
          sub: z.string()
        }),
        sections: z.object({
          newsletter: z.object({ title: z.string(), description: z.string().optional(), color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional() }),
          fieldNotes: z.object({ title: z.string(), description: z.string().optional(), color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional() }),
          workshop: z.object({ title: z.string(), description: z.string().optional(), color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional() }),
          repositories: z.object({ title: z.string(), description: z.string().optional(), color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional() }),
          tools: z.object({ title: z.string(), description: z.string().optional(), color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional() }),
          links: z.object({ title: z.string(), description: z.string().optional(), color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional() }),
          contact: z.object({ title: z.string(), description: z.string().optional(), color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional() }),
          about: z.object({ title: z.string(), description: z.string().optional(), color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional() })
        }),
        topics: z.object({
          items: z.array(z.object({
            name: z.string(),
            tag: z.string(),
            color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple'])
          }))
        }),
        about: z.object({
          headline: z.string(),
          body: z.string(),
          highlights: z.array(z.object({
            label: z.string(),
            value: z.string()
          }))
        }),
        callouts: z.object({
          adomi: z.object({
            eyebrow: z.string().optional(),
            headline: z.string(),
            body: z.string().optional(),
            ctaLabel: z.string(),
            ctaHref: z.string(),
            external: z.boolean().optional(),
            color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional()
          }),
          contact: z.object({
            eyebrow: z.string().optional(),
            headline: z.string(),
            body: z.string().optional(),
            ctaLabel: z.string(),
            ctaHref: z.string(),
            external: z.boolean().optional(),
            color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional()
          }),
          about: z.object({
            eyebrow: z.string().optional(),
            headline: z.string(),
            body: z.string().optional(),
            ctaLabel: z.string(),
            ctaHref: z.string(),
            external: z.boolean().optional(),
            color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional()
          }),
          feedback: z.object({
            eyebrow: z.string().optional(),
            headline: z.string(),
            body: z.string().optional(),
            ctaLabel: z.string(),
            ctaHref: z.string(),
            external: z.boolean().optional(),
            color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional()
          })
        }),
        contact: z.object({
          eyebrow: z.string().optional(),
          headline: z.string(),
          body: z.string(),
          namePlaceholder: z.string(),
          emailPlaceholder: z.string(),
          messagePlaceholder: z.string(),
          buttonLabel: z.string(),
          sendingLabel: z.string(),
          successHeadline: z.string(),
          successBody: z.string(),
          errorFallback: z.string(),
          color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']).optional()
        }),
        newsletter: z.object({
          eyebrow: z.string(),
          headlinePre: z.string(),
          headlineHand: z.string(),
          headlinePost: z.string(),
          body: z.string(),
          rssHref: z.string(),
          placeholder: z.string(),
          buttonLabel: z.string(),
          fineprint: z.string(),
          confirmation: z.string()
        }),
        footblock: z.object({
          brand: z.string(),
          tagline: z.string(),
          elsewhere: z.array(z.object({
            label: z.string(),
            href: z.string(),
            external: z.boolean().optional()
          })),
          copyright: z.string()
        })
      })
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.string(),
        tag: z.string(),
        blurb: z.string(),
        minRead: z.number().optional(),
        order: z.number().optional()
      })
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        code: z.string(),
        stat: z.string(),
        sub: z.string(),
        image: z.string(),
        imageAlt: z.string(),
        color: z.enum(['indigo', 'pink', 'teal', 'orange', 'green', 'purple']),
        blurb: z.string(),
        url: z.string().optional(),
        order: z.number().optional()
      })
    }),
    repositories: defineCollection({
      type: 'data',
      source: 'repositories/*.yml',
      schema: z.object({
        name: z.string(),
        sub: z.string(),
        url: z.string(),
        image: z.string(),
        order: z.number().optional()
      })
    }),
    tools: defineCollection({
      type: 'data',
      source: 'tools/*.yml',
      schema: z.object({
        name: z.string(),
        sub: z.string(),
        url: z.string(),
        image: z.string(),
        order: z.number().optional()
      })
    }),
    links: defineCollection({
      type: 'data',
      source: 'links/*.yml',
      schema: z.object({
        name: z.string(),
        sub: z.string(),
        url: z.string(),
        image: z.string(),
        order: z.number().optional()
      })
    })
  }
})
