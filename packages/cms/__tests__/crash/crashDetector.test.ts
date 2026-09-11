import express, { Request, Response, NextFunction } from 'express'
import request from 'supertest'

// Mock the crashAnalysisService before importing crashDetector
jest.mock('../../src/services/crashAnalysisService', () => {
  const mock = {
    recordRequest: jest.fn(),
    recordTimeout: jest.fn(),
    recordException: jest.fn(),
    getTimeoutThreshold: jest.fn().mockReturnValue(10000),
  }
  return { crashAnalysisService: mock }
})

import { crashDetector, crashExceptionCapture } from '../../src/middleware/crashDetector'
import { crashAnalysisService } from '../../src/services/crashAnalysisService'

const mockedService = crashAnalysisService as jest.Mocked<typeof crashAnalysisService>

describe('crashDetector middleware', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('records request on response finish', async () => {
    const app = express()
    app.use(crashDetector)
    app.get('/test', (_req, res) => res.status(200).json({ ok: true }))

    await request(app).get('/test')

    expect(mockedService.recordRequest).toHaveBeenCalledTimes(1)
    expect(mockedService.recordRequest).toHaveBeenCalledWith(
      'GET',
      '/test',
      200,
      expect.any(Number),
    )
  })

  it('records request with correct status code on error', async () => {
    const app = express()
    app.use(crashDetector)
    app.get('/fail', (_req, res) => res.status(500).json({ error: 'fail' }))

    await request(app).get('/fail')

    expect(mockedService.recordRequest).toHaveBeenCalledWith(
      'GET',
      '/fail',
      500,
      expect.any(Number),
    )
  })

  it('detects timeout when duration exceeds threshold', async () => {
    // Set a very low threshold for testing
    mockedService.getTimeoutThreshold.mockReturnValue(0)

    const app = express()
    app.use(crashDetector)
    app.get('/slow', (_req, res) => {
      // Even a tiny delay will exceed 0ms threshold
      setTimeout(() => res.status(200).json({ ok: true }), 5)
    })

    await request(app).get('/slow')

    expect(mockedService.recordTimeout).toHaveBeenCalledTimes(1)
    expect(mockedService.recordTimeout).toHaveBeenCalledWith(
      'GET',
      '/slow',
      expect.any(Number),
    )
  })

  it('does not record timeout for fast requests', async () => {
    mockedService.getTimeoutThreshold.mockReturnValue(60000) // 60s threshold

    const app = express()
    app.use(crashDetector)
    app.get('/fast', (_req, res) => res.status(200).json({ ok: true }))

    await request(app).get('/fast')

    expect(mockedService.recordTimeout).not.toHaveBeenCalled()
  })
})

describe('crashExceptionCapture middleware', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('records exception and passes to next error handler', async () => {
    const app = express()
    app.get('/error', () => {
      throw new Error('Test crash')
    })
    app.use(crashExceptionCapture)
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      res.status(500).json({ error: err.message })
    })

    const res = await request(app).get('/error')

    expect(res.status).toBe(500)
    expect(mockedService.recordException).toHaveBeenCalledTimes(1)
    expect(mockedService.recordException).toHaveBeenCalledWith(
      'GET',
      '/error',
      expect.any(Error),
      500,
      expect.objectContaining({}),
    )
  })
})
