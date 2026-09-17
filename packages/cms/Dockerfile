# Development stage
# FROM --platform=linux/amd64 oky/base as development
FROM oky/base as development

ENV NODE_ENV=development
ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/packages/cms/firebase-config.json
WORKDIR /usr/src/app/packages/cms

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "const http = require('http'); const req = http.get({ hostname: 'localhost', port: parseInt(process.env.CMS_PORT, 10) || 5000, path: '/health' }, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.setTimeout(5000, () => { req.destroy(); process.exit(1); });"

CMD [ "yarn", "run", "start" ]

# Production stage
# FROM --platform=linux/amd64 node:16.13.1 as production
FROM node:16.13.1 as production

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --from=oky/base /usr/src/app/node_modules ./node_modules
COPY --from=oky/base /usr/src/app/packages/cms/package.json .
COPY --from=oky/base /usr/src/app/packages/cms/dist ./dist

COPY --from=oky/base /usr/src/app/packages/core/package.json ./packages/core/package.json
COPY --from=oky/base /usr/src/app/packages/core/dist ./packages/core/dist
COPY --from=oky/base /usr/src/app/packages/core/src/common/translations ./packages/core/src/common/translations


HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "const http = require('http'); const req = http.get({ hostname: 'localhost', port: parseInt(process.env.CMS_PORT, 10) || 5000, path: '/health' }, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.setTimeout(5000, () => { req.destroy(); process.exit(1); });"

ENV NODE_PATH=/usr/src/app/dist
CMD [ "node", "dist/src/index.js" ]
