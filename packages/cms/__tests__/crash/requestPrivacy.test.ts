import express from 'express'
import request from 'supertest'
import { requestLogger } from '../../src/middleware/requestLogger'
import { crashDetector, crashExceptionCapture } from '../../src/middleware/crashDetector'
import { errorLogger } from '../../src/middleware/errorLogger'
import { requestTimeout } from '../../src/middleware/requestTimeout'
import { logger } from '../../src/logger'
import { crashAnalysisService } from '../../src/services/crashAnalysisService'

jest.mock('../../src/env', () => ({ env: { logging: { slowRequestThreshold: 0 } } }))
jest.mock('../../src/logger', () => ({ logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() } }))
jest.mock('../../src/services/crashAnalysisService', () => ({ crashAnalysisService: {
  recordRequest: jest.fn(), recordTimeout: jest.fn(), recordException: jest.fn(), getTimeoutThreshold: () => 0,
} }))

describe('request URL privacy', () => {
  afterEach(() => jest.clearAllMocks())
  it.each(['ok', 'error', 'timeout'])('omits query values on %s paths and diagnostics', async scenario => {
    const app = express()
    app.use(crashDetector, requestLogger, requestTimeout(10))
    app.get('/private', (_req, res, next) => {
      if (scenario === 'ok') res.send('ok')
      if (scenario === 'error') next(new Error('synthetic failure'))
    })
    app.use(crashExceptionCapture, errorLogger)
    const response = await request(app).get('/private?user_id=PRIVATE_USER&token=PRIVATE_TOKEN')
    expect(response.status).toBe(scenario === 'ok' ? 200 : scenario === 'error' ? 500 : 503)
    for (const mock of [logger.info, logger.warn, logger.error, crashAnalysisService.recordTimeout, crashAnalysisService.recordException]) {
      const output = JSON.stringify((mock as jest.Mock).mock.calls)
      expect(output).not.toContain('PRIVATE_USER')
      expect(output).not.toContain('PRIVATE_TOKEN')
    }
    expect(logger.info).toHaveBeenCalledWith('Incoming request', expect.objectContaining({ url: '/private' }))
  })
})
