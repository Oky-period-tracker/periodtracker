# Development stage
FROM oky/base as development

ENV NODE_ENV=development
WORKDIR /usr/src/app/packages/api

CMD [ "yarn", "run", "watch" ]

# Production stage
FROM node:16.13.1 as production

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --from=oky/base /usr/src/app/node_modules ./node_modules
COPY --from=oky/base /usr/src/app/packages/api/package.json .
COPY --from=oky/base /usr/src/app/packages/api/dist ./dist

COPY --from=oky/base /usr/src/app/packages/core/package.json ./packages/core/package.json
COPY --from=oky/base /usr/src/app/packages/core/dist ./packages/core/dist

WORKDIR /usr/src/app/packages/api

CMD [ "yarn", "start" ]
