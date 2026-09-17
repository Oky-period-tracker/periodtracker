import { Writable } from 'stream'

describe('optional file logging', () => {
  let stream: Writable
  let consoleLog: jest.SpyInstance

  beforeEach(() => {
    consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    stream?.destroy()
    jest.restoreAllMocks()
    jest.resetModules()
  })

  function load(mkdirError?: Error) {
    let logger: any
    jest.isolateModules(() => {
      jest.doMock('../../src/env', () => ({
        env: { logging: { level: 'info', filePath: '/test/cms.log' } },
      }))
      jest.doMock('fs', () => ({
        existsSync: () => !mkdirError,
        mkdirSync: () => {
          if (mkdirError) throw mkdirError
        },
        createWriteStream: () => stream,
      }))
      logger = require('../../src/logger').logger
    })
    return logger
  }

  it('continues console logging if directory creation fails', () => {
    const logger = load(new Error('Permission denied'))
    logger.info('service still running')
    expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('service still running'))
  })

  it('survives an asynchronous file error and disables file writes', () => {
    stream = new Writable({
      write(_chunk, _encoding, done) {
        done()
      },
    })
    const logger = load()
    const write = jest.spyOn(stream, 'write')
    expect(() => stream.emit('error', new Error('Disk full'))).not.toThrow()
    logger.info('service still running')
    expect(write).not.toHaveBeenCalled()
    expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('service still running'))
  })

  it('bounds queued file data while writes are stalled, then resumes on drain', async () => {
    let finish: () => void
    stream = new Writable({
      highWaterMark: 16,
      write(_chunk, _encoding, done) {
        finish = done
      },
    })
    const logger = load()
    logger.info('first')
    const queued = stream.writableLength
    for (let i = 0; i < 100; i++) logger.info('next')
    expect(stream.writableLength).toBe(queued)
    expect(consoleLog).toHaveBeenCalledTimes(101)
    const drained = new Promise<void>((resolve) => stream.once('drain', resolve))
    finish!()
    await drained
    logger.info('resumed')
    expect(stream.writableLength).toBeGreaterThan(0)
  })
})
