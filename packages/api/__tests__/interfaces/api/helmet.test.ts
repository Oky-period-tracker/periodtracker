import express from 'express'
import helmet from 'helmet'
import request from 'supertest'

/**
 * Creates a minimal Express app with the same helmet configuration as bootstrap.ts.
 * Avoids pulling in TypeORM / env dependencies, keeping the test self-contained.
 */
function createApp() {
  const app = express()

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

  app.get('/health', (_req, res) => res.status(200).json({ ok: true }))

  return app
}

describe('Helmet security headers', () => {
  // Single request shared across all assertions for efficiency
  let res: Awaited<ReturnType<ReturnType<typeof request>['get']>>

  beforeAll(async () => {
    res = await request(createApp()).get('/health')
  })

  describe('Content-Security-Policy', () => {
    it('is present', () => {
      expect(res.headers['content-security-policy']).toBeDefined()
    })

    it("sets default-src to 'none'", () => {
      expect(res.headers['content-security-policy']).toContain("default-src 'none'")
    })

    it("sets frame-ancestors to 'none'", () => {
      expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'")
    })
  })

  it('sets X-Content-Type-Options to nosniff', () => {
    expect(res.headers['x-content-type-options']).toBe('nosniff')
  })

  it('sets X-Frame-Options', () => {
    expect(res.headers['x-frame-options']).toBeDefined()
  })

  it('sets Strict-Transport-Security with max-age', () => {
    expect(res.headers['strict-transport-security']).toMatch(/max-age=\d+/)
  })

  it('sets Referrer-Policy to no-referrer', () => {
    expect(res.headers['referrer-policy']).toBe('no-referrer')
  })

  it('sets X-DNS-Prefetch-Control to off', () => {
    expect(res.headers['x-dns-prefetch-control']).toBe('off')
  })

  it('sets X-Download-Options to noopen', () => {
    expect(res.headers['x-download-options']).toBe('noopen')
  })

  it('sets X-Permitted-Cross-Domain-Policies to none', () => {
    expect(res.headers['x-permitted-cross-domain-policies']).toBe('none')
  })

  it('sets Cross-Origin-Opener-Policy', () => {
    expect(res.headers['cross-origin-opener-policy']).toBeDefined()
  })

  it('sets Cross-Origin-Resource-Policy', () => {
    expect(res.headers['cross-origin-resource-policy']).toBeDefined()
  })

  it('disables X-XSS-Protection (sets to 0)', () => {
    expect(res.headers['x-xss-protection']).toBe('0')
  })
})
