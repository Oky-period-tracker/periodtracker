import * as admin from 'firebase-admin'
import { firebaseCredential } from '../../src/helpers/firebaseCredential'

jest.mock('firebase-admin', () => ({
  credential: {
    applicationDefault: jest.fn(() => 'application-default'),
    cert: jest.fn(() => 'cert'),
  },
}))

describe('firebase credential', () => {
  const serviceAccount = {
    project_id: 'example-dev',
    client_email: 'firebase-adminsdk@example-dev.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n',
  }
  const encode = (value: string) => Buffer.from(value).toString('base64')

  beforeEach(() => jest.clearAllMocks())

  it.each([undefined, '', '   '])('uses the key file when the variable is %p', (value) => {
    expect(firebaseCredential(value)).toBe('application-default')
    expect(admin.credential.cert).not.toHaveBeenCalled()
  })

  it('uses the decoded service account when the variable is set', () => {
    const encoded = encode(JSON.stringify(serviceAccount))

    expect(firebaseCredential(`${encoded}\n`)).toBe('cert')
    expect(admin.credential.cert).toHaveBeenCalledWith(serviceAccount)
    expect(admin.credential.applicationDefault).not.toHaveBeenCalled()
  })

  it.each([
    ['not base64', '{not-base64}'],
    ['not JSON once decoded', encode('not json')],
  ])('fails without leaking the value when it is %s', (_label, value) => {
    expect(() => firebaseCredential(value)).toThrow(
      'FIREBASE_SERVICE_ACCOUNT_BASE64 is not a base64 encoded service account JSON file',
    )
    expect(() => firebaseCredential(value)).not.toThrow(value)
  })
})
