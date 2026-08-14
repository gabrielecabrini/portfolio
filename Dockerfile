# syntax=docker/dockerfile:1

# The build runs inside the image on purpose: `docker build .` works standalone,
# without depending on a dist/ produced elsewhere.
FROM node:26-alpine AS build

WORKDIR /app

# `playwright` is a devDependency (unit tests run in real Chromium) and its
# postinstall would pull a ~150MB browser into a stage that never runs tests.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx ng build

# angular.json sets outputMode "static", so the build prerenders every route into
# plain HTML: the runtime only ever serves files, no Node process involved.
FROM nginx:alpine AS runtime

COPY --from=build /app/dist/portfolio/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO /dev/null http://127.0.0.1/ || exit 1
