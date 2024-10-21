import _ from 'lodash'
import { Await } from '../types'
import { httpClient } from './HttpClient'
import {
  deriveKEK,
  generateDEK,
  generateSalt,
  getDEK,
  getSalt,
  getUserIdFromName,
  setDEK,
  setSalt,
  setUserIdForName,
  validateDEK,
} from './encryption'
import { replacePersistPrivateRedux } from '../redux/store'

export const login = async (name: string, password: string) => {
  const [localLoginResult, onlineLoginResponse] = await Promise.all([
    localLogin(name, password),
    onlineLogin(name, password),
  ])

  const { localUserId, DEK } = localLoginResult
  const localLoginSuccess = Boolean(localUserId && DEK)

  const onlineLoginSuccess = Boolean(onlineLoginResponse)
  const onlineUserId = onlineLoginResponse?.user.id

  const loginCase = loginCaseReducer({
    onlineLoginSuccess,
    onlineUserId,
    localLoginSuccess,
    localUserId,
  })

  if (loginCase === 'success' && localUserId && DEK) {
    replacePersistPrivateRedux(localUserId, DEK)
    // TODO: Sync data
    return
  }

  if (loginCase === 'success-local' && localUserId && DEK) {
    replacePersistPrivateRedux(localUserId, DEK)
    return
  }

  if (loginCase === 'success-update_local' && onlineUserId) {
    const postUpdateDEK = await initialiseLocalAccount(name, password, onlineUserId)
    if (!postUpdateDEK) {
      // TODO: ?
      return
    }
    replacePersistPrivateRedux(onlineUserId, postUpdateDEK)
    // TODO: Sync data
    return
  }

  if (loginCase === 'success-initialise_local' && onlineUserId) {
    const initializedDEK = await initialiseLocalAccount(name, password, onlineUserId)
    if (!initializedDEK) {
      // TODO: ?
      return
    }
    replacePersistPrivateRedux(onlineUserId, initializedDEK)
    // TODO: Sync (migrate) data
    return
  }

  if (loginCase === 'fail') {
    return // TODO: Error incorrect username or password
  }

  // replacePersistPrivateRedux() ?
}

type LoginCase =
  | 'success'
  | 'success-local'
  | 'success-update_local'
  | 'success-initialise_local'
  | 'fail'

export const loginCaseReducer = ({
  onlineLoginSuccess,
  onlineUserId,
  localLoginSuccess,
  localUserId,
}: {
  onlineLoginSuccess: boolean
  onlineUserId: string | undefined
  localLoginSuccess: boolean
  localUserId: string | undefined
}): LoginCase => {
  const userIdsMatch = !!localUserId && !!onlineUserId && localUserId === onlineUserId

  // ========== Local & Online ========== //
  if (onlineLoginSuccess && localLoginSuccess) {
    if (!userIdsMatch) {
      // Id conflict, assume user is logging into local account
      return 'success-local'
    }

    return 'success'
  }

  // ========== Online ========== //
  if (onlineLoginSuccess && !localLoginSuccess) {
    if (userIdsMatch) {
      // Local account exists and matches online account, but local validation failed, update local password to match valid online password
      return 'success-update_local'
    }

    if (localUserId && !userIdsMatch) {
      // Id conflict, block login to prevent overwriting local user
      return 'fail'
    }

    // Online successful, no local user, create one
    return 'success-initialise_local'
  }

  // ========== Local ========== //
  if (!onlineLoginSuccess && localLoginSuccess) {
    return 'success-local'
  }

  // ========== Fail ========== //
  if (!onlineLoginSuccess && !localLoginSuccess) {
    return 'fail'
  }

  return 'fail'
}

export const initialiseLocalAccount = async (
  name: string,
  password: string,
  userId: string,
  alt = 0,
) => {
  const suffix = alt ? `_${alt}` : ''
  const savedNameIdMapping = await setUserIdForName(name, userId)
  const salt = generateSalt()
  const savedSalt = await setSalt(userId, salt, suffix)
  const DEK = generateDEK()
  const KEK = deriveKEK(password, salt)
  const savedDEK = await setDEK(userId, DEK, KEK, suffix)

  if (!savedNameIdMapping && savedSalt && savedDEK) {
    return undefined
  }

  return DEK
}

export const saveAltCredentials = async (
  password: string,
  userId: string,
  DEK: string,
  alt: number,
) => {
  if (alt <= 0) {
    throw new Error('alt must be greater than 0')
  }

  const suffix = `_${alt}`
  const salt = generateSalt()
  const savedSalt = await setSalt(userId, salt, suffix)
  const KEK = deriveKEK(password, salt)
  const savedDEK = await setDEK(userId, DEK, KEK, suffix)

  if (savedSalt && savedDEK) {
    return undefined
  }

  return DEK
}

export const localLogin = async (
  name: string,
  password: string,
  alt = 0,
): Promise<{
  localUserId: string | undefined
  DEK: string | undefined
}> => {
  const localUserId = await getUserIdFromName(name)

  const fail = {
    localUserId: undefined,
    DEK: undefined,
  }

  if (!localUserId) {
    // Local account doesn't exist
    return fail
  }

  const suffix = alt ? `_${alt}` : ''
  const salt = await getSalt(localUserId, suffix)

  if (!salt) {
    // No salt - Account unrecoverable
    return fail
  }

  const KEK = deriveKEK(password, salt)
  const DEK = await getDEK(localUserId, KEK, suffix)

  if (DEK === undefined) {
    // No DEK - Account unrecoverable
    return fail
  }

  const isValid = await validateDEK(localUserId, DEK)

  const maxAlts = 1
  if (!isValid && alt < maxAlts) {
    // Validation failed, check same password with alternate salt & DEK
    return localLogin(name, password, alt + 1)
  }

  if (!isValid) {
    // Account exists but incorrect credentials
    return {
      localUserId,
      DEK: undefined,
    }
  }

  // Local login Success
  return {
    localUserId,
    DEK,
  }
}

const onlineLogin = async (name: string, password: string) => {
  try {
    const response: Await<ReturnType<typeof httpClient.login>> = await httpClient.login({
      name,
      password,
    })
    return response
  } catch (e) {
    return null
  }
}

export const formatPassword = (password: string) => {
  return _.toLower(password).trim()
}
