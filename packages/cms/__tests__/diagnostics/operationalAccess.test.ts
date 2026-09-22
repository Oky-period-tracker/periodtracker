import express from 'express'
import { EventEmitter } from 'events'
import request from 'supertest'
import passport from 'passport'
import { crashAnalysisService } from '../../src/services/crashAnalysisService'

jest.mock('typeorm', () => ({
  createConnection: jest.fn().mockResolvedValue({}),
  getConnection: () => ({ isConnected: true, query: async () => [] }),
}))
jest.mock('../../ormconfig', () => ({ __esModule: true, default: {} }))
jest.mock('../../src/routes', () => ({
  Routes: [
    {
      method: 'get',
      route: '/test/security',
      action: 'page',
      isPublic: true,
      controller: class {
        page(_req: any, res: any) {
          res.render('Login', {
            contentFilterOptions: [],
            cmsLanguages: [{ locale: 'en', name: 'English' }],
          })
        }
      },
    },
    {
      method: 'put',
      route: '/test/reorder',
      action: 'reorder',
      controller: class {
        async reorder(req: any) {
          const { bulkUpdateRowReorder } = require('../../src/helpers/common')
          return await bulkUpdateRowReorder(
            { update: async () => ({ affected: 1 }) },
            req.body.rowReorderResult,
          )
        }
      },
    },
  ],
}))
jest.mock('../../src/entity/User', () => ({ User: class {} }))
jest.mock('@oky/core', () => ({ cmsLocales: ['en'], defaultLocale: 'en' }))
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: { applicationDefault: jest.fn() },
}))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))
jest.mock('../../src/env', () => ({
  env: { app: { secret: 'test-secret' }, storage: {}, api: { port: 5000 }, logging: {} },
}))
jest.mock('../../src/controller/DataController', () => ({
  DataController: class {
    uploadContentSheet = jest.fn()
    uploadAppTranslationsSheet = jest.fn()
    uploadCmsTranslationsSheet = jest.fn()
    uploadCountriesSheet = jest.fn()
    uploadProvincesSheet = jest.fn()
  },
}))
jest.mock('../../src/controller/ArticleVoiceOverController', () => ({
  ArticleVoiceOverController: class {
    upload = jest.fn()
  },
}))

const paths = [
  '/diagnostics/report',
  '/diagnostics/exceptions',
  '/diagnostics/memory',
  '/diagnostics/timeouts',
  '/diagnostics/endpoints',
  '/monitoring/health',
  '/monitoring/metrics',
  '/monitoring/routes',
  '/monitoring/slow-routes',
]

describe('production operational route access', () => {
  let app: express.Application
  let role: string | undefined
  const signals = ['SIGTERM', 'SIGINT', 'uncaughtException', 'unhandledRejection'] as const
  const listeners = new Map<string, Function[]>()

  beforeAll(async () => {
    for (const signal of signals) listeners.set(signal, (process as EventEmitter).listeners(signal))
    jest.spyOn(passport, 'session').mockImplementation(() => (req, _res, next) => {
      if (role) req.user = { id: 'test-admin', type: role, lang: 'en' } as any
      next()
    })
    const started = new Promise<void>((resolve) => {
      jest
        .spyOn(express.application, 'listen')
        .mockImplementation(function (this: express.Application, ...args: any[]) {
          app = this
          args[args.length - 1]()
          resolve()
          return { close: jest.fn() } as any
        })
    })
    require('../../src/index')
    await started
  })

  afterAll(() => {
    crashAnalysisService.stopMemorySampling()
    for (const signal of signals) {
      for (const listener of (process as EventEmitter).listeners(signal)) {
        if (!listeners.get(signal)!.includes(listener))
          (process as EventEmitter).removeListener(signal, listener as any)
      }
    }
    jest.restoreAllMocks()
  })

  it('uses a fresh CSP nonce matching the rendered inline script', async () => {
    const first = await request(app).get('/test/security')
    const second = await request(app).get('/test/security')
    expect(first.status).toBe(200)
    const policy = first.headers['content-security-policy']
    const scriptPolicy = policy.split(';').find((value: string) => value.startsWith('script-src '))
    expect(scriptPolicy).not.toContain("'unsafe-inline'")
    const nonce = /'nonce-([^']+)'/.exec(scriptPolicy)?.[1]
    expect(nonce).toBeTruthy()
    expect(first.text).toContain(`nonce="${nonce}"`)
    expect(second.headers['content-security-policy']).not.toContain(`'nonce-${nonce}'`)
  })

  it('sends completed reorder results through the production route wrapper', async () => {
    role = 'superAdmin'
    const response = await request(app)
      .put('/test/reorder')
      .send({ rowReorderResult: [{ id: 'test-row', sortingKey: 1 }] })
      .timeout({ response: 1000, deadline: 2000 })
    expect(response.status).toBe(200)
    expect(response.body).toEqual([{ affected: 1 }])
  })

  it.each(paths)('rejects anonymous access to %s', async (url) => {
    role = undefined
    const response = await request(app).get(url)
    expect(response.status).toBe(401)
    expect(response.headers['cache-control']).toBe('private, no-store')
  })

  it.each(['admin', 'contentManager'])(
    'rejects the %s role on every operational route',
    async (type) => {
      role = type
      for (const url of paths) expect((await request(app).get(url)).status).toBe(403)
    },
  )

  it.each(paths)('allows super admins to access %s', async (url) => {
    role = 'superAdmin'
    const response = await request(app).get(url)
    expect(response.status).toBe(200)
    expect(response.headers['cache-control']).toBe('private, no-store')
  })

  it.each(['/health', '/health/live', '/health/ready'])('keeps %s public', async (url) => {
    role = undefined
    expect((await request(app).get(url)).status).toBe(200)
  })
})
