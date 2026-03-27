import { logger } from '../logger'

interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  label?: string
}

/**
 * Retries an async operation with exponential backoff.
 * Jitter is added to prevent thundering herd.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 30000, label = 'Operation' } = options

  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt >= maxRetries) {
        logger.error(`${label} failed after ${maxRetries + 1} attempts`, {
          message: lastError.message,
          attempt: attempt + 1,
        })
        throw lastError
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
      const jitter = delay * (0.5 + Math.random() * 0.5)

      logger.warn(`${label} failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${Math.round(jitter)}ms`, {
        message: lastError.message,
      })

      await new Promise((resolve) => setTimeout(resolve, jitter))
    }
  }

  throw lastError
}
