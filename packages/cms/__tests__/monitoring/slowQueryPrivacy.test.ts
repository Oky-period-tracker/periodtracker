jest.mock('../../src/env', () => ({
  env: { db: { logging: false }, logging: { level: 'debug', slowQueryThreshold: 1000 } },
}))
jest.mock('../../src/logger', () => ({
  logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

import { env } from '../../src/env'
import { logger } from '../../src/logger'
import { SlowQueryLogger } from '../../src/middleware/slowQueryLogger'

describe('SQL logging privacy', () => {
  afterEach(() => jest.clearAllMocks())

  it.each([false, true])('respects DATABASE_LOGGING=%s in TypeORM configuration', (enabled) => {
    env.db.logging = enabled
    let config: any
    jest.isolateModules(() => {
      config = require('../../ormconfig')
    })
    expect(config.logging).toBe(enabled ? 'all' : false)
    expect(config.maxQueryExecutionTime).toBe(enabled ? 1000 : undefined)
    expect(Boolean(config.logger)).toBe(enabled)
  })

  it('omits sensitive values from debug, slow and failed queries', () => {
    const sqlLogger = new SlowQueryLogger()
    const secret = 'PRIVATE_TEST_VALUE'
    const query = `SELECT '${secret}', $1`
    const error = Object.assign(new Error(`duplicate value ${secret}`), { code: '23505' })
    sqlLogger.logQuery(query, [secret])
    sqlLogger.logQuerySlow(1200, query, [secret])
    sqlLogger.logQueryError(error, query, [secret])
    sqlLogger.logQueryError(`failure ${secret}`, query, [secret])
    for (const method of [logger.debug, logger.warn, logger.error]) {
      const calls = (method as jest.Mock).mock.calls
      expect(calls.length).toBeGreaterThan(0)
      expect(JSON.stringify(calls)).not.toContain(secret)
      expect(calls[0][1]).toEqual(expect.objectContaining({ parameterCount: 1 }))
    }
    expect(logger.warn).toHaveBeenCalledWith(
      'Slow query detected',
      expect.objectContaining({ duration: '1200ms' }),
    )
    expect(logger.error).toHaveBeenCalledWith(
      'Query error',
      expect.objectContaining({ code: '23505' }),
    )
  })
})
