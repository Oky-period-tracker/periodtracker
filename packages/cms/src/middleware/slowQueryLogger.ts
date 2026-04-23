import { Logger as TypeORMLogger, QueryRunner } from 'typeorm'
import { logger } from '../logger'
import { env } from '../env'

export class SlowQueryLogger implements TypeORMLogger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (env.logging.level === 'debug') {
      logger.debug('Query', {
        query,
        parameters: parameters?.length ? parameters : undefined,
      })
    }
  }

  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.error('Query error', {
      error: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      query,
      parameters: parameters?.length ? parameters : undefined,
    })
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.warn('Slow query detected', {
      duration: `${time}ms`,
      threshold: `${env.logging.slowQueryThreshold}ms`,
      query,
      parameters: parameters?.length ? parameters : undefined,
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
