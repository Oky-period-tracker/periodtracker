import 'reflect-metadata'
import { createConnection, getConnection } from 'typeorm'
import express, { Request, Response } from 'express'
import * as bodyParser from 'body-parser'
import { Routes } from './routes'
import passport from 'passport'
import flash from 'connect-flash'
import i18n from 'i18n'
import cors from 'cors'
import { Strategy } from 'passport-local'
import cookieParser from 'cookie-parser'
import session from 'cookie-session'
import { Authentication } from './access/authentication'
import * as admin from 'firebase-admin'
import { env } from './env'
import ormconfig from '../ormconfig'
import { DataController } from './controller/DataController'
import multer from 'multer'
import path from 'path'
import { cmsLocales, defaultLocale } from '@oky/core'
import { ArticleVoiceOverController } from './controller/ArticleVoiceOverController'
import helmet from 'helmet'
import { requestLogger } from './middleware/requestLogger'
import { errorLogger } from './middleware/errorLogger'
import { responseTimeTracker } from './middleware/responseTimeTracker'
import { MonitoringController } from './controller/MonitoringController'
import { HealthController } from './controller/HealthController'
import { DiagnosticsController } from './controller/DiagnosticsController'
import { healthCheckService } from './services/healthCheckService'
import { crashAnalysisService } from './services/crashAnalysisService'
import { crashDetector, crashExceptionCapture } from './middleware/crashDetector'
import { requestTimeout } from './middleware/requestTimeout'
import { withRetry } from './helpers/retry'
import { logger } from './logger'

withRetry(() => createConnection(ormconfig), {
  maxRetries: 5,
  baseDelay: 2000,
  maxDelay: 30000,
  label: 'Database connection',
})
  .then(() => {
    const app = express()
    app.set('view engine', 'ejs')
    app.set('views', __dirname + '/views')

    // Security headers
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'none'"],
            frameAncestors: ["'none'"],
          },
        },
      }),
    )

    // ======================= Health Check Endpoints =============================
    const healthController = new HealthController()
    app.get('/health', (req, res) => healthController.health(req, res))
    app.get('/health/live', (req, res) => healthController.live(req, res))
    app.get('/health/ready', (req, res) => healthController.ready(req, res))

    // ======================= Crash Analysis =============================
    app.use(crashDetector)

    // ======================= Request Timeout =============================
    app.use(requestTimeout())

    // ======================= Monitoring =============================
    app.use(responseTimeTracker)

    // ======================= Logging =============================
    app.use(requestLogger)

    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
      }),
    )
    app.use(express.static(__dirname + '/public'))
    i18n.configure({
      locales: cmsLocales,
      directory: path.join(
        path.dirname(require.resolve('@oky/core/package.json')),
        'src/common/translations',
      ),
      defaultLocale,
      cookie: 'i18n',
    })

    app.use(i18n.init)
    // ======================= Passport Configuration =============================
    app.use(cookieParser())
    app.use(
      session({
        secret: env.app.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        },
      }),
    )
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

    passport.use(new Strategy(Authentication.authenticate))
    passport.serializeUser<any, any>(Authentication.serializeUser)
    passport.deserializeUser<any, any>(Authentication.deserializeUser)

    app.use((req, res, next) => {
      // @ts-ignore
      res.locals.globalErrors = req.flash('error')
      res.locals.currentUser = req.user
      i18n.setLocale(req, req.user ? req.user.lang : defaultLocale)
      next()
    })

    // ======================= i18n Configuration =============================
    Routes.forEach((route) => {
      if (route.isPublic) {
        return
      }
      app.use(route.route, Authentication.isLoggedIn)
    })

    app.use('/mobile/suggestions', cors())
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: env.storage.bucket,
      // databaseURL: 'https://oky-app.firebaseio.com', // @TODO:PH
    })
    // ============================ Upload  =======================================

    const upload = multer({ storage: multer.memoryStorage() })
    const dataController = new DataController()
    app.post(
      '/data/upload-content-sheet',
      upload.single('spreadsheet'),
      dataController.uploadContentSheet,
    )
    app.post(
      '/data/upload-app-translations-sheet',
      upload.single('spreadsheet'),
      dataController.uploadAppTranslationsSheet,
    )
    app.post(
      '/data/upload-cms-translations-sheet',
      upload.single('spreadsheet'),
      dataController.uploadCmsTranslationsSheet,
    )
    app.post(
      '/data/upload-countries-sheet',
      upload.single('spreadsheet'),
      dataController.uploadCountriesSheet,
    )
    app.post(
      '/data/upload-provinces-sheet',
      upload.single('spreadsheet'),
      dataController.uploadProvincesSheet,
    )

    const voiceOverController = new ArticleVoiceOverController()

    // Audio
    app.post('/api/voice-over/article/upload', upload.single('file'), voiceOverController.upload)

    // ============================ Routes  =======================================
    Routes.forEach((route) => {
      ;(app as any)[route.method](route.route, (req: Request, res: Response, next: any) => {
        try {
          const result = new (route.controller as any)()[route.action](req, res, next)
          if (result instanceof Promise) {
            result
              .then((_result) => {
                if (_result !== null && _result !== undefined && !res.headersSent) {
                  res.send(_result)
                }
              })
              .catch((error: Error) => {
                logger.error('Route handler error', {
                  method: req.method,
                  url: req.originalUrl,
                  action: route.action,
                  controller: route.controller?.name,
                  message: error?.message,
                  stack: error?.stack,
                })
                crashAnalysisService.recordException(req.method, req.originalUrl, error, 500, {
                  controller: route.controller?.name,
                  action: route.action,
                  userId: (req.user as any)?.id,
                })
                if (!res.headersSent) {
                  next(error)
                }
              })
          } else if (result !== null && result !== undefined && !res.headersSent) {
            res.json(result)
          }
        } catch (syncError) {
          logger.error('Route handler sync error', {
            method: req.method,
            url: req.originalUrl,
            action: route.action,
            controller: route.controller?.name,
            message: (syncError as Error)?.message,
          })
          if (!res.headersSent) {
            next(syncError)
          }
        }
      })
    })

    // ======================= Monitoring Endpoints ====================
    const monitoringController = new MonitoringController()
    app.get('/monitoring/health', (req, res, next) => monitoringController.health(req, res, next))
    app.get('/monitoring/metrics', (req, res, next) => monitoringController.metrics(req, res, next))
    app.get('/monitoring/routes', (req, res, next) => monitoringController.routes(req, res, next))
    app.get('/monitoring/slow-routes', (req, res, next) => monitoringController.slowRoutes(req, res, next))

    // ======================= Diagnostics Endpoints ====================
    const diagnosticsController = new DiagnosticsController()
    app.get('/diagnostics/report', (req, res) => diagnosticsController.report(req, res))
    app.get('/diagnostics/exceptions', (req, res) => diagnosticsController.exceptions(req, res))
    app.get('/diagnostics/memory', (req, res) => diagnosticsController.memory(req, res))
    app.get('/diagnostics/timeouts', (req, res) => diagnosticsController.timeouts(req, res))
    app.get('/diagnostics/endpoints', (req, res) => diagnosticsController.endpoints(req, res))

    // ======================= Crash Exception Capture ====================
    app.use(crashExceptionCapture)

    // ======================= Error Logging =============================
    app.use(errorLogger)

    const port = env.api.port || 5000
    const server = app.listen(port, () => {
      healthCheckService.markServiceReady()
      crashAnalysisService.startMemorySampling()
      logger.info(`Server started on port ${port}`)
    })

    // ======================= Graceful Shutdown =============================
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} received — starting graceful shutdown`)
      healthCheckService.markServiceNotReady()
      crashAnalysisService.stopMemorySampling()

      server.close(() => {
        logger.info('HTTP server closed')
        getConnection()
          .close()
          .then(() => {
            logger.info('Database connection closed')
            process.exit(0)
          })
          .catch((err) => {
            logger.error('Error closing database connection', { error: err?.message })
            process.exit(1)
          })
      })

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        logger.error('Graceful shutdown timed out — forcing exit')
        process.exit(1)
      }, 30000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    // ======================= Crash Capture (process-level) ==================
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', { message: error?.message, stack: error?.stack })
      crashAnalysisService.recordException('PROCESS', 'uncaughtException', error, 500)
      gracefulShutdown('uncaughtException')
    })

    process.on('unhandledRejection', (reason: any) => {
      const error = reason instanceof Error ? reason : new Error(String(reason))
      logger.error('Unhandled rejection', { message: error.message, stack: error.stack })
      crashAnalysisService.recordException('PROCESS', 'unhandledRejection', error, 500)
    })
  })
  .catch((error) => logger.error('Failed to start server', { error: error?.message, stack: error?.stack }))
