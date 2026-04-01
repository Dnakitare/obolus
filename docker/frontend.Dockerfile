FROM node:20-alpine AS builder
WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./
COPY packages/frontend/package.json packages/frontend/

# Install all workspace deps
RUN npm ci --workspace=packages/frontend

# Copy frontend source and build
COPY packages/frontend packages/frontend
RUN npm run build --workspace=packages/frontend

FROM nginx:alpine
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
