# ─── Stage 1: Production dependencies ────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma/
RUN npx prisma generate

# ─── Stage 2: Full build (includes devDeps) ───────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

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

# Prisma: query engine + schema engine (for `prisma db push`)
COPY --from=builder /app/node_modules/.prisma        ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma        ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma         ./node_modules/prisma
COPY --from=builder /app/prisma                      ./prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Push schema to Neon then start
CMD ["sh", "-c", "node node_modules/prisma/build/index.js db push && node server.js"]
