# Stage 1: Base image with Node.js and pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 3: Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . . 
RUN pnpm run build
RUN pnpm run db:push

# Stage 4: Production server
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Run migrations and start the server
CMD ["node","server.js"]

