#FROM node:20-alpine
#
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#COPY nest-cli.json tsconfig*.json ./
#COPY apps ./apps
#COPY libs ./libs
#
#RUN npm ci
#
#CMD ["node", "-e", "console.log('Specify a command in docker-compose')"]
#



FROM node:20-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY nest-cli.json tsconfig*.json ./
COPY apps ./apps
COPY libs ./libs

RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /usr/src/app/dist ./dist

ENV APP_NAME=gateway
ENV PORT=3000

CMD ["sh", "-c", "node dist/apps/$APP_NAME/main.js"]
