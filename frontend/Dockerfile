FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Nginx ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./public /usr/share/nginx/html/public

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
