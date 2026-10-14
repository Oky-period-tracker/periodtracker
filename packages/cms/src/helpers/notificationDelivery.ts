import { TimeoutError } from './timeout'

/**
 * Delivery status stored on `notification.status`.
 *
 * The mobile app only ever reads rows with status `sent`, so anything else is
 * invisible to users and exists purely to tell the admin what really happened.
 */
export const NOTIFICATION_STATUS = {
  /** Firebase accepted the message and returned a message id. */
  SENT: 'sent',
  /** Firebase explicitly rejected the message — nothing was delivered. */
  FAILED: 'failed',
  /**
   * We never got an answer (timeout, or the CMS died mid-send). The alert may
   * or may not have gone out, so re-sending it risks notifying everyone twice.
   */
  UNKNOWN: 'unknown',
} as const

/**
 * Firebase error codes that mean "we rejected this and delivered nothing".
 * Only these are safe to retry: any other failure may already have reached the
 * users, and a broadcast sent twice is worse than one we report as uncertain.
 */
const RETRIABLE_FIREBASE_ERROR_CODES = new Set([
  'messaging/server-unavailable',
  'messaging/internal-error',
  // The connection never got established, so nothing reached Firebase.
  'app/network-error',
])

/**
 * Failures where Firebase never told us what it did with the message. Treated
 * as `unknown` rather than `failed`: the alert may already be on its way, so
 * re-sending it would notify every user twice.
 */
const UNKNOWN_OUTCOME_FIREBASE_ERROR_CODES = new Set([
  'app/network-timeout',
  'messaging/unknown-error',
])

const FIREBASE_ERROR_MESSAGES: { [code: string]: string } = {
  'messaging/invalid-argument':
    'Firebase rejected the notification because the title or the message is not valid.',
  'messaging/invalid-payload':
    'Firebase rejected the notification because the title or the message is not valid.',
  'messaging/authentication-error':
    'The CMS could not authenticate with Firebase. The service account credentials need to be checked.',
  'messaging/mismatched-credential':
    'The Firebase credentials configured for this CMS belong to a different project.',
  'messaging/server-unavailable':
    'Firebase is temporarily unavailable. Nothing was sent — please try again in a few minutes.',
  'messaging/internal-error':
    'Firebase returned an internal error. Nothing was sent — please try again in a few minutes.',
  'messaging/quota-exceeded':
    'The Firebase sending quota has been exceeded. Nothing was sent — please try again later.',
  'app/invalid-credential':
    'The Firebase credentials configured for this CMS are invalid or expired.',
  'app/network-error':
    'The CMS could not reach Firebase. Nothing was sent — check the server network connection and try again.',
}

function firebaseErrorCode(error: any): string | undefined {
  return error?.code || error?.errorInfo?.code
}

/** True when the failure is a clean rejection that is safe to send again. */
export function isRetriableFirebaseError(error: Error): boolean {
  if (error instanceof TimeoutError) {
    return false
  }
  const code = firebaseErrorCode(error)
  return code ? RETRIABLE_FIREBASE_ERROR_CODES.has(code) : false
}

/**
 * True when we cannot tell whether users received the notification. These are
 * recorded as `unknown` rather than `failed` so nobody re-broadcasts blindly.
 */
export function isDeliveryOutcomeUnknown(error: Error): boolean {
  if (error instanceof TimeoutError) {
    return true
  }
  const code = firebaseErrorCode(error)
  return code ? UNKNOWN_OUTCOME_FIREBASE_ERROR_CODES.has(code) : false
}

/** Turns a Firebase/transport error into something an admin can act on. */
export function describeDeliveryError(error: any): string {
  if (error instanceof TimeoutError) {
    return 'Firebase did not answer in time, so the notification could not be confirmed. Check the Firebase console before sending it again — it may already have reached users.'
  }

  const code = firebaseErrorCode(error)
  if (code && UNKNOWN_OUTCOME_FIREBASE_ERROR_CODES.has(code)) {
    return `Firebase never confirmed what happened to this notification (${code}). Check the Firebase console before sending it again — it may already have reached users.`
  }

  if (code && FIREBASE_ERROR_MESSAGES[code]) {
    return FIREBASE_ERROR_MESSAGES[code]
  }

  if (code) {
    return `Firebase refused the notification (${code}). Nothing was sent.`
  }

  return error?.message
    ? `The notification could not be sent: ${error.message}`
    : 'The notification could not be sent.'
}
