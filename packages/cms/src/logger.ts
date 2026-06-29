import fs from 'fs'
import path from 'path'
import { env } from './env'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const minLevel = LOG_LEVELS[env.logging.level] ?? LOG_LEVELS.info

let logStream: fs.WriteStream | null = null

if (env.logging.filePath) {
  const dir = path.dirname(env.logging.filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  logStream = fs.createWriteStream(env.logging.filePath, { flags: 'a' })
}

function formatEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const entry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
  }
  return JSON.stringify(entry)
}

function write(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (LOG_LEVELS[level] < minLevel) {
    return
  }

  const line = formatEntry(level, message, meta)

  // Console output
  switch (level) {
    case 'error':
      console.error(line)
      break
    case 'warn':
      console.warn(line)
      break
    default:
      console.log(line)
  }

  // File output
  if (logStream) {
    logStream.write(line + '\n')
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => write('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => write('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => write('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write('error', message, meta),
}
