FROM node:boron-alpine as builder
MAINTAINER Cristtopher Quintana T. <cquintana@axxezo.com>

COPY package.json .
RUN npm install -g @angular/cli@1.1.1
RUN npm i && mkdir /unwp-frontend && cp -R ./node_modules ./unwp-frontend

WORKDIR /unwp-frontend

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build -aot -e prod

FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY nginx/unwp-frontend.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /unwp-frontend/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
