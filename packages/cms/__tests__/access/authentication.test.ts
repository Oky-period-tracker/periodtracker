import { Authentication } from '../../src/access/authentication'
import { AccessController } from '../../src/controller/AccessController'
import { UserController } from '../../src/controller/UserController'
import { sessionCookie, sessionExpiry } from '../../src/middleware/session'
import * as typeorm from 'typeorm'
import bcrypt from 'bcrypt'
import express from 'express'
import passport from 'passport'
import request from 'supertest'

jest.mock('typeorm', () => {
  return {
    getRepository: jest.fn(),
    BaseEntity: class Mock {},
    ObjectType: () => null,
    Entity: () => null,
    InputType: () => null,
    Index: () => null,
    PrimaryGeneratedColumn: () => null,
    Column: () => null,
    CreateDateColumn: () => null,
    UpdateDateColumn: () => null,
    OneToMany: () => null,
    ManyToOne: () => null,
  }
})

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('new_hash'),
}))

describe('Authentication', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should authenticate successfully', async () => {
    const mockUser = { username: 'john', password: 'hashed_password' }
    ;(typeorm.getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockUser),
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    const done = jest.fn()
    await Authentication.authenticate('john', 'password', done)

    expect(done).toHaveBeenCalledWith(null, mockUser)
  })

  it('should fail authentication if user not found', async () => {
    ;(typeorm.getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    })

    const done = jest.fn()
    await Authentication.authenticate('john', 'password', done)

    expect(done).toHaveBeenCalledWith(null, false, { message: 'No user registered' })
  })

  it('should fail authentication if password does not match', async () => {
    const mockUser = { username: 'john', password: 'hashed_password' }
    ;(typeorm.getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockUser),
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

    const done = jest.fn()
    await Authentication.authenticate('john', 'wrong_password', done)

    expect(done).toHaveBeenCalledWith(null, false, { message: 'No password match' })
  })
})

describe('Login session', () => {
  function createApp() {
    const authenticator = new passport.Passport()
    authenticator.serializeUser<any, any>(Authentication.serializeUser)
    authenticator.deserializeUser((id: number, done) => done(null, { id } as any))

    const app = express()
    app.use(sessionCookie('test-secret', false))
    app.use(sessionExpiry)
    app.use(authenticator.initialize())
    app.use(authenticator.session())
    // A login path other than AccessController.login
    app.get('/login', (req, res, next) =>
      req.logIn({ id: 1 } as any, (error) => (error ? next(error) : res.sendStatus(204))),
    )
    app.get('/private', Authentication.isLoggedIn, (_req, res) => res.sendStatus(204))
    return app
  }

  it('stamps the login time on any req.logIn, so the session survives sessionExpiry', async () => {
    const agent = request.agent(createApp())
    await agent.get('/login')

    expect((await agent.get('/private')).status).toBe(204)
  })

  it('redirects a page request without a session to /login', async () => {
    const res = await request(createApp()).get('/private')

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/login')
  })

  it('answers 401 to an AJAX call without a session', async () => {
    const res = await request(createApp()).get('/private').set('X-Requested-With', 'XMLHttpRequest')

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: 'Authentication required' })
  })
})

describe('Session revocation', () => {
  let users: Record<number, any>

  beforeEach(() => {
    users = { 1: { id: 1, username: 'john', password: 'hashed_password', sessionVersion: 0 } }
    ;(typeorm.getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn(async (id: number) => users[id] && { ...users[id] }),
      increment: jest.fn(async ({ id }, column: string, value: number) => {
        users[id][column] += value
      }),
      save: jest.fn(async (user: any) => {
        users[user.id] = { ...user }
      }),
    })
  })

  function createApp() {
    const authenticator = new passport.Passport()
    authenticator.serializeUser<any, any>(Authentication.serializeUser)
    authenticator.deserializeUser<any, any>(Authentication.deserializeUser)

    const app = express()
    app.use(express.json())
    app.use(sessionCookie('test-secret', false))
    app.use(sessionExpiry)
    app.use(authenticator.initialize())
    app.use(authenticator.session())
    app.get('/login', (req, res, next) =>
      req.logIn({ ...users[1] }, (error) => (error ? next(error) : res.sendStatus(204))),
    )
    app.get('/private', Authentication.isLoggedIn, (_req, res) => res.sendStatus(204))
    app.get('/logout', Authentication.isLoggedIn, (req, res, next) =>
      new AccessController().logout(req, res, next).catch(next),
    )
    app.put('/user/:id', (req, res, next) =>
      new UserController()
        .update(req, res, next)
        .then(() => res.sendStatus(204))
        .catch(next),
    )
    return app
  }

  // The cookie as an attacker would copy it from the browser
  async function copiedSessionCookie(app: express.Express) {
    const res = await request(app).get('/login')
    const cookies: string[] = res.get('Set-Cookie')
    return cookies.map((cookie) => cookie.split(';')[0])
  }

  it('accepts the session cookie while logged in', async () => {
    const app = createApp()
    const cookie = await copiedSessionCookie(app)

    expect((await request(app).get('/private').set('Cookie', cookie)).status).toBe(204)
  })

  it('rejects a copied session cookie after logout', async () => {
    const app = createApp()
    const cookie = await copiedSessionCookie(app)

    const logout = await request(app).get('/logout').set('Cookie', cookie)
    expect(logout.headers.location).toBe('/login')

    const replay = await request(app).get('/private').set('Cookie', cookie)
    expect(replay.status).toBe(302)
    expect(replay.headers.location).toBe('/login')
  })

  it('accepts a new login after logout', async () => {
    const app = createApp()
    await request(app)
      .get('/logout')
      .set('Cookie', await copiedSessionCookie(app))

    const cookie = await copiedSessionCookie(app)
    expect((await request(app).get('/private').set('Cookie', cookie)).status).toBe(204)
  })

  it('rejects a copied session cookie after the user is edited', async () => {
    const app = createApp()
    const cookie = await copiedSessionCookie(app)

    await request(app)
      .put('/user/1')
      .send({ username: 'john', password: 'new_password', lang: 'en', type: 'superAdmin' })
      .expect(204)

    expect((await request(app).get('/private').set('Cookie', cookie)).status).toBe(302)
  })

  it('rejects the session cookie of a deleted user instead of failing', async () => {
    const app = createApp()
    const cookie = await copiedSessionCookie(app)
    delete users[1]

    expect((await request(app).get('/private').set('Cookie', cookie)).status).toBe(302)
  })
})
