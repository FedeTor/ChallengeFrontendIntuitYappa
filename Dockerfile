FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine

# Remove default nginx site and copy Angular build (output lives in dist/<app>/browser)
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/clientes.frontend/browser /usr/share/nginx/html

# Custom nginx server config for the SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Temp directory that nginx can write without extra privileges
RUN mkdir -p /tmp/nginx/client_temp && chown -R nginx:nginx /tmp/nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
