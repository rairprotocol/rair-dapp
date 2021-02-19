FROM node:12.18-alpine AS build
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install 
COPY . .
RUN npm run build 



FROM nginx:1.17.5-alpine AS prod-stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]