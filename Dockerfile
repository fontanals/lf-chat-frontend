# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_SERVICE_TYPE
ARG VITE_API_BASE_URL
ARG VITE_DEMO_ACCOUNT_EMAIL
ARG VITE_DEMO_ACCOUNT_PASSWORD

ENV VITE_SERVICE_TYPE=${VITE_SERVICE_TYPE}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_DEMO_ACCOUNT_EMAIL=${VITE_DEMO_ACCOUNT_EMAIL}
ENV VITE_DEMO_ACCOUNT_PASSWORD=${VITE_DEMO_ACCOUNT_PASSWORD}

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Development stage
FROM node:22-alpine AS development

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production stage
FROM nginx:alpine AS production

RUN apk add --no-cache openssl curl

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY scripts/docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint.sh"]