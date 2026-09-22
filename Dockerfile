# Production Multi-Stage Dockerfile for Google Cloud Run
# Optimized for Fast Cold-Starts and Minimal Footprint

# Stage 1: Build Frontend & Server Bundle
FROM node:22-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build Vite client SPA to /dist and bundle server.ts to dist/server.cjs
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package descriptors and install production runtime dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/metadata.json ./metadata.json

# Cloud Run default port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Launch the compiled CJS server
CMD ["node", "dist/server.cjs"]
