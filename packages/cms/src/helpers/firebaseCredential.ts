import * as admin from 'firebase-admin'

/**
 * Picks the credential firebase-admin authenticates with.
 *
 * Deployments that cannot ship a key file (e.g. AWS ECS, configured through an
 * env file) pass the service account JSON, base64 encoded, in
 * FIREBASE_SERVICE_ACCOUNT_BASE64. Without it, the key file named by
 * GOOGLE_APPLICATION_CREDENTIALS is used.
 */
export function firebaseCredential(serviceAccountBase64?: string): admin.credential.Credential {
  const encoded = serviceAccountBase64?.trim()
  if (!encoded) {
    return admin.credential.applicationDefault()
  }

  let serviceAccount: admin.ServiceAccount
  try {
    serviceAccount = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'))
  } catch (e) {
    // The value is a secret, keep it out of the message.
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_BASE64 is not a base64 encoded service account JSON file',
    )
  }
  return admin.credential.cert(serviceAccount)
}
