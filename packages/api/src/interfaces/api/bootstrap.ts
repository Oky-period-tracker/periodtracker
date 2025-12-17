import { useExpressServer, Action } from 'routing-controllers'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { env } from 'interfaces/env'
import cors from 'cors'

const dirs = {
  controllers: [__dirname + '/controllers/**/*.{ts,js}'],
  middlewares: [__dirname + '/middlewares/*.{ts,js}'],
}

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true)
    }

    // Common localhost origins for development (Expo web, React Native, etc.)
    const allowedOrigins = [
      'http://localhost:19006', // Expo web default
      'http://localhost:8081', // Expo web alternative
      'http://localhost:3000', // Common dev server
      'http://localhost:19000', // Expo web alternative
      'http://127.0.0.1:19006',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:19000',
    ]

    // Add deleteAccountUrl if it exists
    if (env.deleteAccountUrl) {
      allowedOrigins.push(env.deleteAccountUrl)
    }

    // Allow any localhost origin in development
    if (env.isDevelopment && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true)
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}

export async function bootstrap() {
  const app = express()

  app.use(cors(corsOptions))

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
