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
  hash,
  setAnswerDEK,
  setDEK,
  setSalt,
  setUserIdForName,
  validateDEK,
} from './encryption'
import { logOutUserRedux, replacePersistPrivateRedux } from '../redux/store'
import { useDispatch } from 'react-redux'
import { useSelector } from '../redux/useSelector'
import { LoginResponse } from '../core/api'
import { privateStoreSelector } from '../redux/selectors/private/privateSelectors'
import { initUser, loginFailure, setAuthError, syncPrivateStores } from '../redux/actions'
import moment from 'moment'
import { User } from '../redux/reducers/private/userReducer'
import {
  deleteSecureValue,
  getSecureValue,
  removeAsyncStorageItem,
  setSecureValue,
} from './storage'
import { analytics } from './firebase'

export const useCreateAccount = () => {
  const dispatch = useDispatch()

  return async (payload: User) => {
    const { name, password, secretAnswer, id } = payload
    const dateSignedUp = moment.utc().toISOString()

    const DEK = await initialiseLocalAccount(name, password, secretAnswer, id)

    if (!DEK) {
      dispatch(setAuthError({ error: 'auth_fail' }))
      return
    }

    replacePersistPrivateRedux(id, DEK)

    let isGuest = true
    let token = null

    try {
      const {
        appToken,
        user,
      }: Await<ReturnType<typeof httpClient.signup>> = await httpClient.signup({
        ...payload,
        preferredId: id || null,
        dateSignedUp,
      })

      if (!appToken || !user || !user.id) {
        throw new Error(`Invalid data`)
      }

      isGuest = false
      token = appToken
    } catch (e) {
      /*       
        Account save failed, but can proceed as local offline user
        Saga will periodically attempt to save account online, 
        or they can press button in the profile screen 
      */
    }

    dispatch(
      initUser({
        user: {
          ...payload,
          isGuest,
        },
        appToken: token,
      }),
    )
  }
}

const useSyncPrivateStores = () => {
  const dispatch = useDispatch()

  return (onlineLoginResponse: LoginResponse | null) => {
    const localPrivateStore = useSelector(privateStoreSelector)
    const localLastModified = localPrivateStore.lastModified

    const onlinePrivateStore = onlineLoginResponse?.store?.appState?.private

    if (!onlinePrivateStore) {
      return
    }

    const onlineLastModified = onlinePrivateStore?.lastModified

    let stores = {
      oldStore: onlinePrivateStore,
      newStore: localPrivateStore,
    }

    if (onlineLastModified > localLastModified) {
      stores = {
        oldStore: localPrivateStore,
        newStore: onlinePrivateStore,
      }
    }

    dispatch(syncPrivateStores(stores))
  }
}

export const useLogin = () => {
  const dispatch = useDispatch()
  const syncPrivateStores = useSyncPrivateStores()

  return async (name: string, password: string, answer: string) => {
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
      syncPrivateStores(onlineLoginResponse)
      return
    }

    if (loginCase === 'success-local' && localUserId && DEK) {
      replacePersistPrivateRedux(localUserId, DEK)
      return
    }

    if (['success-initialise_local', 'success-update_local'].includes(loginCase) && onlineUserId) {
      const initializedDEK = await initialiseLocalAccount(name, password, answer, onlineUserId)
      if (!initializedDEK) {
        return // ERROR
      }
      replacePersistPrivateRedux(onlineUserId, initializedDEK)
      syncPrivateStores(onlineLoginResponse)
      return
    }

    // Fail
    dispatch(loginFailure({ error: 'login_fail' }))
  }
}

export const deleteAccount = async (
  username: string,
  password: string,
  appToken?: string,
  isGuest?: boolean,
  userId?: string,
) => {
  logOutUserRedux()

  const { localUserId, DEK } = await localLogin(username, password)

  if (!DEK || !localUserId || localUserId !== userId) {
    return false
  }

  const onlineSuccess = false

  if (appToken) {
    try {
      await httpClient.deleteUserFromPassword({
        name,
        password,
      })
    } catch (e) {
      return false
    }
  }

  if (appToken && !isGuest && !onlineSuccess) {
    return false
  }

  // Log out
  logOutUserRedux()

  // Delete local storage
  removeAsyncStorageItem(`persist:${userId}`)
  deleteSecureValue(`username_${hash(username)}`)
  deleteSecureValue(`${userId}_encrypted_dek`)
  deleteSecureValue(`${userId}_answer_encrypted_dek`)
  deleteSecureValue(`${userId}_hashed_dek`)
  deleteSecureValue(`${userId}_salt`)
  deleteSecureValue(`${userId}_answer_salt`)

  // analytics
  analytics?.().logEvent('deleteAccount')

  return true
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
      // Local account exists and matches online account, but local validation failed
      // Possible if online password was updated but local was not
      // Cannot decrypt DEK without local password, local data unrecoverable unless secret is valid
      // TODO: Prompt user to enter secret answer?
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
  answer: string,
  userId: string,
  alt = 0,
) => {
  const suffix = alt ? `_${alt}` : ''
  const savedNameIdMapping = await setUserIdForName(name, userId)
  const salt = generateSalt()
  const savedSalt = await setSalt(userId, salt, suffix)
  const DEK = generateDEK()
  const KEK = deriveKEK(password, salt)
  const savedDEK = await setDEK(userId, DEK, KEK)

  const answerSalt = generateSalt()
  const savedAnswerSalt = await setSalt(userId, answerSalt, suffix, 'answer_')
  const answerKEK = deriveKEK(answer, answerSalt)
  const savedAnswerDEK = await setAnswerDEK(userId, DEK, answerKEK)

  if (!savedNameIdMapping && savedSalt && savedAnswerSalt && savedDEK && savedAnswerDEK) {
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

export const onlineLogin = async (name: string, password: string) => {
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

export const changeLocalPassword = async (
  userId: string,
  answer: string,
  newPassword: string,
  preserveOldPassword: boolean,
) => {
  const salt = await getSalt(userId, undefined, '_answer')

  if (!salt) {
    return false
  }

  const KEK = deriveKEK(answer, salt)
  const DEK = await getDEK(userId, KEK, undefined, '_answer')

  if (!DEK) {
    return false
  }

  // If no suffix, old eDEK is overwritten, old password invalidated
  const suffix = preserveOldPassword ? `_1` : ''
  const newSalt = generateSalt()
  const savedSalt = await setSalt(userId, newSalt, suffix)
  const newKEK = deriveKEK(newPassword, salt)
  const savedDEK = await setDEK(userId, DEK, newKEK, suffix)

  return savedSalt && savedDEK
}

export const commitAltPassword = async (userId: string, alt = 1) => {
  const suffix = `_${alt}`
  const altSalt = await getSalt(userId, suffix)
  const altEncryptedDEK = await getSecureValue(`${userId}_encrypted_dek${suffix}`)

  if (!altSalt || !altEncryptedDEK) {
    return false
  }

  const savedSalt = await setSalt(userId, altSalt)
  const savedEncryptedDEK = await setSecureValue(`${userId}_encrypted_dek`, altEncryptedDEK)

  if (!savedSalt || !savedEncryptedDEK) {
    return false
  }

  await deleteAltPassword(userId, alt)
  return true
}

export const deleteAltPassword = async (userId: string, alt = 1) => {
  const suffix = `_${alt}`
  await Promise.all([
    deleteSecureValue(`${userId}_encrypted_dek${suffix}`),
    deleteSecureValue(`${userId}_salt${suffix}`),
  ])
}

export const formatPassword = (password: string) => {
  return _.toLower(password).trim()
}
