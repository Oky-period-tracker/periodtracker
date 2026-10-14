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

/**
 * Parse a content filter or age restriction level sent by a form. A blank or
 * invalid value means "no restriction" (0), so it never reaches an integer
 * column as "" or NaN.
 */
export function toLevel(value: unknown): number {
  const level = Number(value)
  return Number.isInteger(level) && level >= 0 ? level : 0
}

/** Keep URL query values out of request logs and diagnostics. */
export function safeRequestPath(url: string): string {
  return (url || '').split(/[?#]/, 1)[0].slice(0, 512)
}

export function isSafeBannerImage(image: unknown): image is string {
  if (typeof image !== 'string' || /[<>"'\s]/.test(image)) return false
  if (image === '') return true
  if (/^data:image\/(png|jpeg|gif|webp|avif|bmp);base64,[a-z0-9+/]+={0,2}$/i.test(image))
    return true
  if (image.startsWith('/') && !image.startsWith('//') && !image.includes('\\')) return true
  try {
    const url = new URL(image)
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password
  } catch (_) {
    return false
  }
}
