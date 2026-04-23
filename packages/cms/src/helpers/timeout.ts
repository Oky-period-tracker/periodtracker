/**
 * Wraps a promise with a timeout. Rejects if the promise doesn't resolve within the given time.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, label = 'Operation'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`))
    }, ms)

    promise
      .then((result) => {
        clearTimeout(timer)
        resolve(result)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

/** Default query timeout in ms (30 seconds) */
export const DEFAULT_QUERY_TIMEOUT = 30_000

/** Default request timeout in ms (60 seconds) */
export const DEFAULT_REQUEST_TIMEOUT = 60_000

/** Default external service timeout in ms (15 seconds) */
export const DEFAULT_EXTERNAL_TIMEOUT = 15_000
