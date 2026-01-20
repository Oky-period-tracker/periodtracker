# Updated to Node.js 20 LTS to meet dependency requirements
# FROM --platform=linux/amd64 node:20-alpine
FROM node:20

WORKDIR /usr/src/app

ENV DOCKER_ENV=true

# Dependencies
COPY package.json yarn.lock ./
COPY packages/core/package.json ./packages/core/ 
COPY packages/api/package.json ./packages/api/
COPY packages/cms/package.json ./packages/cms/

RUN NOYARNPOSTINSTALL=1 yarn

COPY .prettierrc tsconfig.json tslint.json ./
COPY packages/core ./packages/core
COPY packages/api ./packages/api
COPY packages/cms ./packages/cms

RUN yarn run clean
RUN yarn run compile