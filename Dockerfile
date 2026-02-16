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



FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy pre-built dist folder from your local machine
COPY dist ./dist

ENV APP_NAME=gateway
ENV PORT=3000

CMD ["sh", "-c", "node dist/apps/$APP_NAME/main.js"]