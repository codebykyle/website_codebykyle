<p align="center">
  <img src="./docs/logo.svg" width="160" alt="codebykyle" />
</p>

# codebykyle

The source for [codebykyle.com](https://www.codebykyle.com), my personal site: writing, projects, and links worth sharing.

<p>
  <a href="https://nuxt.com"><img src="https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white" alt="Nuxt 4" /></a>
  <a href="https://content.nuxt.com"><img src="https://img.shields.io/badge/Nuxt_Content-3-00DC82?logo=markdown&logoColor=white" alt="Nuxt Content 3" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" /></a>
</p>

## Highlights

- ✍️ Everything on the page comes from Markdown and YAML in `content/`
- 🗂️ Blog posts, projects, repositories, tools, and links, one file per entry
- 🙈 Sections with no entries are hidden
- 📬 Newsletter signup (MailerLite) and a contact form (SMTP)
- 🐳 One Docker image, published to `ghcr.io/codebykyle/website_codebykyle`

# Getting started

> [!WARNING]
> This project uses [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev
```

The site runs on http://localhost:3000.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

The newsletter and contact form work without any configuration: they log what they receive. Fill in `.env` to send them for real.

## Adding content

| Folder | What goes in it |
|---|---|
| `content/landing.yml` | Page copy: hero, about, newsletter, contact, footer |
| `content/blog/*.md` | Blog posts |
| `content/projects/*.md` | Projects |
| `content/repositories/*.yml` | Repositories |
| `content/tools/*.yml` | Tools |
| `content/links/*.yml` | Links |

A number in front of a file name (`01-first-post.md`) sets its order on the page.

# License

[MIT](./LICENSE)
