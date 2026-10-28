# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=22-alpine

# ─────────────────────────────────────────────────────────────────────────────
# build stage — install deps, build the Nuxt app to .output/
# ─────────────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS build
WORKDIR /app

# better-sqlite3 (used by @nuxt/content) compiles native bindings, so we need
# the build toolchain. Stays in this stage; nothing native ships in runtime.
RUN apk add --no-cache python3 make g++

# pnpm via corepack — picks up the version pinned in package.json#packageManager
RUN corepack enable

# Install deps first to maximize layer cache on source-only changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
RUN pnpm build

# ─────────────────────────────────────────────────────────────────────────────
# runtime stage — minimal image that just runs the prebuilt server bundle
# ─────────────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000 \
    PORT=3000

# Run as a non-root user.
RUN addgroup -S app && adduser -S app -G app

# Nitro's `node` preset emits a fully self-contained server bundle into .output,
# so we don't need to copy node_modules separately.
COPY --from=build --chown=app:app /app/.output ./.output

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
