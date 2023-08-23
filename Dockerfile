FROM node:16.13.1

WORKDIR /usr/src/app

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