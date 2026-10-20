# ---- Stage 1: build ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: serve ----
FROM nginx:1.27-alpine

# Replace nginx's default site config with ours
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy only the build output from stage 1
# (use /app/build instead of /app/dist for Create React App)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80