import { logger } from '../logger'

interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  label?: string
  /**
   * Decides whether a given failure is worth retrying. Returning false stops the
   * loop and rethrows straight away. Defaults to retrying every error.
   *
   * Use this for operations that are not safe to repeat blindly
   */
  shouldRetry?: (error: Error) => boolean
}

/**
 * Retries an async operation with exponential backoff.
 * Jitter is added to prevent thundering herd.
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    label = 'Operation',
    shouldRetry = () => true,
  } = options

  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      const attemptsUsed = attempt + 1
      const retriesExhausted = attempt >= maxRetries
      const retriable = shouldRetry(lastError)

      if (retriesExhausted || !retriable) {
        logger.error(`${label} failed after ${attemptsUsed} attempt(s)`, {
          message: lastError.message,
          attempt: attemptsUsed,
          retriable,
        })
        throw lastError
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
      const jitter = delay * (0.5 + Math.random() * 0.5)

      logger.warn(
        `${label} failed (attempt ${attemptsUsed}/${maxRetries + 1}), retrying in ${Math.round(
          jitter,
        )}ms`,
        {
          message: lastError.message,
        },
      )

      await new Promise((resolve) => setTimeout(resolve, jitter))
    }
  }

  throw lastError
}
