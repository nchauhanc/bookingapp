# ─── Stage 1: Production dependencies ────────────────────────────────────────
FROM node:20-alpine AS deps
# openssl is required by the Prisma schema engine binary on Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Generate Prisma client (downloads linux-musl-openssl-3.0.x binary)
COPY prisma ./prisma/
RUN npx prisma generate

# ─── Stage 2: Full build (includes devDeps) ───────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Generate Prisma client with correct Alpine binary
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# A DATABASE_URL is required at build time even though the DB isn't used during build
ENV DATABASE_URL=file:/tmp/build.db

RUN npm run build

# ─── Stage 3: Production runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Next.js standalone output
COPY --from=builder /app/public            ./public
COPY --from=builder /app/.next/standalone  ./
COPY --from=builder /app/.next/static      ./.next/static

# Prisma: query engine client + schema engine (for `prisma db push`)
COPY --from=builder /app/node_modules/.prisma        ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma        ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma         ./node_modules/prisma
COPY --from=builder /app/prisma                      ./prisma

# Persistent SQLite volume mount point
RUN mkdir -p /data && chown nextjs:nodejs /data

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Apply schema to DB then start server
CMD ["sh", "-c", "node node_modules/prisma/build/index.js db push && node server.js"]
