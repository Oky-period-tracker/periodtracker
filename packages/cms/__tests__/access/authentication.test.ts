import { Authentication } from '../../src/access/authentication'
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
}))

describe('Authentication', () => {
  const mockUserLookup = (user) => {
    const queryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    }
    ;(typeorm.getRepository as jest.Mock).mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    })
    return queryBuilder
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should authenticate successfully', async () => {
    const mockUser = { username: 'john', password: 'hashed_password' }
    mockUserLookup(mockUser)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    const done = jest.fn()
    await Authentication.authenticate('john', 'password', done)

    expect(done).toHaveBeenCalledWith(null, mockUser)
  })

  it('asks for the password hash, which is not selected by default', async () => {
    const queryBuilder = mockUserLookup({ username: 'john', password: 'hashed_password' })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    await Authentication.authenticate('john', 'password', jest.fn())

    expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.password')
    expect(queryBuilder.where).toHaveBeenCalledWith('user.username = :username', {
      username: 'john',
    })
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed_password')
  })

  it('should fail authentication if user not found', async () => {
    mockUserLookup(undefined)

    const done = jest.fn()
    await Authentication.authenticate('john', 'password', done)

    expect(done).toHaveBeenCalledWith(null, false, { message: 'No user registered' })
  })

  it('should fail authentication if password does not match', async () => {
    const mockUser = { username: 'john', password: 'hashed_password' }
    mockUserLookup(mockUser)
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
