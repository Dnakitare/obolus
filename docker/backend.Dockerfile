FROM node:20-alpine AS builder
WORKDIR /app
COPY packages/backend/package.json packages/backend/package-lock.json ./
RUN npm ci
COPY packages/backend .
RUN npx prisma generate
RUN npx tsc

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
RUN mkdir -p /app/data /app/uploads
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
