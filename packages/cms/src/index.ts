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
import { cmsLocales } from './i18n/options'
// import { run } from './projections/populate' // @TODO:PH

import * as formUpload from 'express-fileupload'

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
      directory: __dirname + '/i18n/translations',
      defaultLocale: env.defaultLocale,
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
        cookie: { sameSite: 'strict' },
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
      i18n.setLocale(req, req.user ? req.user.lang : env.defaultLocale)
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

    app.use(formUpload.default())

    // ============================ Routes  =======================================
    Routes.forEach((route) => {
      ;(app as any)[route.method](route.route, async (req: Request, res: Response, next: any) => {
        try {
          const instance = new (route.controller as any)()
          const method = instance[route.action]
          const rawResult = method.apply(instance, [req, res, next])
          const result = await rawResult
          if (result !== null && result !== undefined) {
            if (rawResult instanceof Promise) {
              if (result?.isFile) {
                // do not return a response since we handle the stream when sending a file to client
                return
              }
              res.send(result)
            } else {
              res.json(result)
            }
          }
        } catch (e) {
          res.json({
            error: true,
            message: e.message,
          })
          console.warn(e)
        }
      })
    })

    app.listen(env.api.port)
    console.log(`Server started on port ${env.api.port}`)
  })
  .catch((error) => console.log(error))
