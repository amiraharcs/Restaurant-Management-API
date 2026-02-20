FROM node:20-alpine AS builder
WORKDIR /app

COPY Frontend/oaxaca-frontend/package*.json ./
RUN npm ci

COPY Frontend/oaxaca-frontend/. .

ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

FROM nginx:1.27-alpine

COPY deploy/oracle/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
