import 'reflect-metadata'
import { createConnection } from 'typeorm'
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

createConnection(ormconfig)
  .then(() => {
    const app = express()
    app.set('view engine', 'ejs')
    app.set('views', __dirname + '/views')
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
        const result = new (route.controller as any)()[route.action](req, res, next)
        if (result instanceof Promise) {
          result.then((_result) =>
            _result !== null && _result !== undefined ? res.send(_result) : undefined,
          )
        } else if (result !== null && result !== undefined) {
          res.json(result)
        }
      })
    })

    app.listen(5000)
    console.log('Server started on port 5000')
  })
  .catch((error) => console.log(error))
