import express from 'express'
import request from 'supertest'
import { SESSION_MAX_AGE, sessionCookie, sessionExpiry } from '../../src/middleware/session'

function createApp(secure = false) {
  const app = express()
  app.set('trust proxy', 1)
  app.use(sessionCookie('test-secret', secure))
  app.use(sessionExpiry)

  // Stands in for passport: logs user 1 in at the given time
  app.get('/login', (req, res) => {
    req.session.passport = { user: 1 }
    if (req.query.loginAt) {
      req.session.loginAt = Number(req.query.loginAt)
    }
    res.sendStatus(204)
  })
  app.get('/whoami', (req, res) => res.json({ user: req.session.passport?.user ?? null }))

  return app
}

describe('Session cookie', () => {
  it('is httpOnly, SameSite=Strict and expires', async () => {
    const res = await request(createApp()).get(`/login?loginAt=${Date.now()}`)
    const cookie = res.headers['set-cookie'][0]

    expect(cookie).toMatch(/^session=/)
    expect(cookie).toContain('httponly')
    expect(cookie).toContain('samesite=strict')
    expect(cookie).toMatch(/expires=/)
  })

  it('is Secure behind an HTTPS load balancer', async () => {
    const res = await request(createApp(true))
      .get(`/login?loginAt=${Date.now()}`)
      .set('X-Forwarded-Proto', 'https')

    expect(res.headers['set-cookie'][0]).toContain('; secure')
  })
})

describe('Session expiry', () => {
  async function whoamiAfterLogin(query: string) {
    const agent = request.agent(createApp())
    await agent.get(`/login${query}`)
    return (await agent.get('/whoami')).body.user
  }

  it('keeps a session younger than SESSION_MAX_AGE', async () => {
    expect(await whoamiAfterLogin(`?loginAt=${Date.now()}`)).toBe(1)
  })

  it('logs out a session older than SESSION_MAX_AGE', async () => {
    expect(await whoamiAfterLogin(`?loginAt=${Date.now() - SESSION_MAX_AGE - 1}`)).toBeNull()
  })

  it('logs out a session without a login time', async () => {
    expect(await whoamiAfterLogin('')).toBeNull()
  })
})
