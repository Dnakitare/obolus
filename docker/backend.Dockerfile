FROM node:20-alpine AS builder
WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./
COPY packages/backend/package.json packages/backend/

# Install all workspace deps
RUN npm ci --workspace=packages/backend

# Copy backend source
COPY packages/backend packages/backend
RUN npx prisma generate --schema=packages/backend/prisma/schema.prisma
RUN npm run build --workspace=packages/backend

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend/node_modules ./node_modules
COPY --from=builder /app/packages/backend/package.json .
RUN mkdir -p /app/data /app/uploads
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
