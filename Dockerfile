FROM node:23-alpine AS base


FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_PLAYER_PARSER_URL=BAKED_NEXT_PUBLIC_PLAYER_PARSER_URL
ARG NEXT_PUBLIC_API_URL=BAKED_NEXT_PUBLIC_API_URL
RUN npm run build


FROM base AS runner
LABEL org.opencontainers.image.source=https://github.com/radiquum/anix
RUN apk add --no-cache bash
WORKDIR /app
COPY ./scripts ./scripts
RUN chmod +x ./scripts/replace-build-env.sh
RUN chmod +x ./scripts/start.sh
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["/app/scripts/start.sh"]
