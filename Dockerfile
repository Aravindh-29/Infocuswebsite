# syntax=docker/dockerfile:1

# Build the complete static website, including the emails.json recipients.
FROM node:24-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve only the exported files. Node.js and source code stay in the build stage.
FROM nginx:1.30-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/out/ /usr/share/nginx/html/

USER nginx
EXPOSE 8080
STOPSIGNAL SIGQUIT

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1

# Skip the image's configuration scripts: this config already supports non-root.
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
