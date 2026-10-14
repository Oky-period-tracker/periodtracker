import { Logger as TypeORMLogger, QueryRunner } from 'typeorm'
import { logger } from '../logger'
import { env } from '../env'

export class SlowQueryLogger implements TypeORMLogger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (env.logging.level === 'debug') {
      logger.debug('Query', {
        parameterCount: parameters?.length || 0,
      })
    }
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    // SQL, bind values and driver messages can all contain personal data.
    const code = typeof error === 'string' ? undefined : (error as any).code
    logger.error('Query error', {
      code: typeof code === 'string' && /^[0-9A-Z]{5}$/.test(code) ? code : undefined,
      parameterCount: parameters?.length || 0,
    })
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.warn('Slow query detected', {
      duration: `${time}ms`,
      threshold: `${env.logging.slowQueryThreshold}ms`,
      parameterCount: parameters?.length || 0,
    })
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    logger.info('Schema build', { message })
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    logger.info('Migration', { message })
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    switch (level) {
      case 'warn':
        logger.warn(typeof message === 'string' ? message : JSON.stringify(message))
        break
      default:
        logger.info(typeof message === 'string' ? message : JSON.stringify(message))
    }
  }
}
