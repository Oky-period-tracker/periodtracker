import { logger } from '../logger'

/**
 * Safely parse JSON with a fallback value instead of throwing.
 */
export function safeJsonParse<T>(json: string, fallback: T, label = 'JSON'): T {
  try {
    return JSON.parse(json)
  } catch (error) {
    logger.warn(`${label} parse failed, using fallback`, {
      message: (error as Error)?.message,
      inputLength: json?.length,
    })
    return fallback
  }
}

/**
 * Safely convert an unknown error value to a structured object with message and stack.
 */
export function toError(value: unknown): Error {
  if (value instanceof Error) return value
  if (typeof value === 'string') return new Error(value)
  return new Error(String(value))
}
