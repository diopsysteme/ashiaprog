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


#
#FROM node:20-alpine AS deps
#WORKDIR /usr/src/app
#COPY package*.json ./
#RUN npm ci --only=production
#
#FROM node:20-alpine
#WORKDIR /usr/src/app
#ENV NODE_ENV=production
#
#COPY package*.json ./
#COPY --from=deps /usr/src/app/node_modules ./node_modules
#
## Copy pre-built dist folder from your local machine
#COPY dist ./dist
#
#ENV APP_NAME=gateway
#ENV PORT=3000
#
#CMD ["sh", "-c", "node dist/apps/$APP_NAME/main.js"]

#FROM node:20-alpine AS build
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#RUN npm ci
#
#COPY nest-cli.json tsconfig*.json ./
#COPY apps ./apps
#COPY libs ./libs
#
#RUN npm run build
#
#FROM node:20-alpine
#WORKDIR /usr/src/app
#ENV NODE_ENV=production
#
#COPY package*.json ./
#RUN npm ci --only=production
#
#COPY --from=build /usr/src/app/dist ./dist
#
#ENV APP_NAME=gateway
#ENV PORT=3000
#
#CMD ["sh", "-c", "node dist/apps/$APP_NAME/main.js"]

#
#FROM node:20-alpine AS build
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#RUN npm ci
#
#COPY nest-cli.json tsconfig*.json ./
#COPY apps ./apps
#COPY libs ./libs
#
## Build only the apps you actually have
#RUN npx nest build gateway \
# && npx nest build identity \
# && npx nest build filemanagement \
# && npx nest build messaging
#
#FROM node:20-alpine
#WORKDIR /usr/src/app
#ENV NODE_ENV=production
#
#COPY package*.json ./
#RUN npm ci --only=production
#
#COPY --from=build /usr/src/app/dist ./dist
#
#ENV APP_NAME=gateway
#ENV PORT=3000
#
#CMD ["sh", "-c", "node dist/apps/$APP_NAME/main.js"]


FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci  # installe TOUT (devDependencies inclus)

COPY nest-cli.json tsconfig*.json ./
COPY apps ./apps
COPY libs ./libs

ENV PORT=3000
CMD ["npm", "run", "start:dev", "gateway"]