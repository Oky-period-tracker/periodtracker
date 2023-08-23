import { useExpressServer, Action } from 'routing-controllers'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { env } from 'interfaces/env'

const dirs = {
  controllers: [__dirname + '/controllers/**/*.{ts,js}'],
  middlewares: [__dirname + '/middlewares/*.{ts,js}'],
}

export async function bootstrap() {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())

  useExpressServer(app, {
    controllers: dirs.controllers,
    middlewares: dirs.middlewares,
    defaultErrorHandler: true,
    classTransformer: true,
    validation: true,
    currentUserChecker: async (action: Action) => {
      if (action.request.authToken) {
        return action.request.authToken.id
      }
    },
  })

  return app.listen(env.api.port)
}
