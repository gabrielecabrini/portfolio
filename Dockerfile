# syntax=docker/dockerfile:1

# The build runs inside the image on purpose: `docker build .` works standalone,
# without depending on a dist/ produced elsewhere. Debian rather than Alpine
# because the build prints the CV PDFs with Playwright's Chromium, which doesn't
# run on musl.
FROM node:26 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && npx playwright install --with-deps chromium

COPY . .
RUN npm run build

# Astro outputs plain static files: the runtime only ever serves files, no Node
# process involved.
FROM nginx:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO /dev/null http://127.0.0.1/ || exit 1
