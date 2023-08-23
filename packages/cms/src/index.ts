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
import session from 'express-session'
import { Authentication } from './access/authentication'
import * as admin from 'firebase-admin'
import { env } from './env'
import ormconfig from '../ormconfig'

//

createConnection(ormconfig)
  .then(() => {
    const app = express()
    app.set('view engine', 'ejs')
    app.set('views', __dirname + '/views')
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
    app.use(express.static(__dirname + '/public'))
    i18n.configure({
      locales: ['en', 'id', 'mn'],
      directory: __dirname + '/i18n/translations',
      defaultLocale: 'en',
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
      i18n.setLocale(req, req.user ? req.user.lang : 'en')
      next()
    })

    // ======================= i18n Configuration =============================

    app.use('/quizzes', Authentication.isLoggedIn)
    app.use('/encyclopedia', Authentication.isLoggedIn)
    app.use('/articles', Authentication.isLoggedIn)
    app.use('/user', Authentication.isLoggedIn)
    app.use('/quiz-management', Authentication.isLoggedIn)
    app.use('/user-management', Authentication.isLoggedIn)
    app.use('/survey-management', Authentication.isLoggedIn)
    app.use('/didyouknow-management', Authentication.isLoggedIn)
    app.use('/suggestions-management', Authentication.isLoggedIn)
    app.use('/catsubcat-management', Authentication.isLoggedIn)
    app.use('/notifications-management', Authentication.isLoggedIn)
    app.use('/analytics-management', Authentication.isLoggedIn)
    app.use('/help-center-management', Authentication.isLoggedIn)
    app.use('/privacy-policy-management', Authentication.isLoggedIn)
    app.use('/about-management', Authentication.isLoggedIn)
    app.use('/about-banner-management', Authentication.isLoggedIn)
    app.use('/terms-and-conditions-management', Authentication.isLoggedIn)
    app.use('/avatar-message-management', Authentication.isLoggedIn)
    app.use('/mobile/suggestions', cors())
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    })
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
