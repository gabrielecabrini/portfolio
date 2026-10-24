# syntax=docker/dockerfile:1

# The build runs inside the image on purpose: `docker build .` works standalone,
# without depending on a dist/ produced elsewhere. Debian rather than Alpine
# because the build prints the CV PDFs with Playwright's Chromium, which doesn't
# run on musl.
FROM node:26 AS build

WORKDIR /app

# Yarn 1 is installed only if the base image doesn't already ship it.
RUN command -v yarn || npm install -g yarn@1.22.22

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn playwright install --with-deps chromium

COPY . .
RUN yarn build

# Astro outputs plain static files: the runtime only ever serves files, no Node
# process involved.
FROM nginx:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO /dev/null http://127.0.0.1/ || exit 1
