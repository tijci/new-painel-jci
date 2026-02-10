# ============================================
# ESTÁGIO 1: deps - Todas as dependências (para build)
# ============================================
FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


# ============================================
# ESTÁGIO 2: builder - Compilação do projeto
# ============================================
FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# ============================================
# ESTÁGIO 3: prod-deps - Apenas dependências de produção
# ============================================
FROM node:24-alpine AS prod-deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev


# ============================================
# ESTÁGIO 4: runner - Imagem final de produção
# ============================================
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="192.168.15.224"

# Cria usuário não-root ANTES de copiar arquivos
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# IMPORTANTE: Usa --chown diretamente no COPY para evitar layer extra
# Isso economiza ~800 MB comparado com RUN chown -R

COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/server.ts ./server.ts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
RUN mkdir -p /app/db && chown -R nextjs:nodejs /app/db
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated

USER nextjs

EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]