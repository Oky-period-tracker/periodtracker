import _ from 'lodash'
import { Await, User, UserCredentials } from '../types'
import { httpClient } from './HttpClient'
import {
  checkNameAvailableLocally,
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
import { initUser, loginFailure, setAuthError, syncPrivateStoresRequest } from '../redux/actions'
import moment from 'moment'
import {
  deleteSecureValue,
  getSecureValue,
  removeAsyncStorageItem,
  setSecureValue,
} from './storage'
import { analytics } from './firebase'
import { useAuth } from '../contexts/AuthContext'
import { appTokenSelector, currentUserSelector } from '../redux/selectors'
import { useLoading } from '../contexts/LoadingProvider'

export const useCreateAccount = () => {
  const dispatch = useDispatch()
  const { setLoading } = useLoading()

  return async (payload: User & UserCredentials) => {
    setLoading(true)
    const { password, secretAnswer, ...baseUser } = payload
    const { name, id } = baseUser
    const dateSignedUp = moment.utc().toISOString()

    const nameAvailable = await checkUserNameAvailability(name)
    if (!nameAvailable) {
      setLoading(false)
      return false
    }

    const DEK = await initialiseLocalAccount(name, password, id, secretAnswer)

    if (!DEK) {
      dispatch(setAuthError({ error: 'auth_fail' }))
      setLoading(false)
      return false
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
      // Online account save failed, but can proceed as local offline user
    }

    dispatch(
      initUser({
        user: {
          ...baseUser,
          isGuest,
        },
        appToken: token,
      }),
    )

    setLoading(false)
  }
}

export const useLogin = () => {
  const dispatch = useDispatch()
  const { setIsLoggedIn } = useAuth()
  const { setLoading } = useLoading()

  return async (name: string, password: string) => {
    setLoading(true)
    const [localLoginResult, onlineLoginResponse] = await Promise.all([
      localLogin({ name, password }),
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

    const onlinePrivateStore = onlineLoginResponse?.store?.appState?.private

    if (loginCase === 'success' && localUserId && DEK) {
      replacePersistPrivateRedux(localUserId, DEK, () => {
        if (onlinePrivateStore) {
          dispatch(syncPrivateStoresRequest(onlinePrivateStore))
        }
        setIsLoggedIn(true)
      })

      return true
    }

    if (loginCase === 'success-local' && localUserId && DEK) {
      replacePersistPrivateRedux(localUserId, DEK)
      setIsLoggedIn(true)
      return true
    }

    if (['success-initialise_local', 'success-update_local'].includes(loginCase) && onlineUserId) {
      const initializedDEK = await initialiseLocalAccount(name, password, onlineUserId)
      if (!initializedDEK) {
        return false // ERROR
      }

      replacePersistPrivateRedux(onlineUserId, initializedDEK, () => {
        if (onlinePrivateStore) {
          dispatch(syncPrivateStoresRequest(onlinePrivateStore))
        }
        setIsLoggedIn(true)
      })
      setIsLoggedIn(true)
      return true
    }

    // Fail
    dispatch(loginFailure({ error: 'login_fail' }))
    setLoading(false)
    return false
  }
}

export const useDeleteAccount = () => {
  const userId = useSelector(currentUserSelector)?.id
  const appToken = useSelector(appTokenSelector)
  const { setLoading } = useLoading()

  return async (name: string, password: string) => {
    setLoading(true)
    const isLoggedIn = !!userId
    const existsLocally = await getUserIdFromName(name)
    const { localUserId, DEK } = await localLogin({ name, password })

    if ((isLoggedIn || existsLocally) && (!DEK || !localUserId)) {
      // Exists locally but validation failed, do not delete
      setLoading(false)
      return false
    }

    // Local validation success OR doesn't exist locally
    // Attempt online change

    let onlineSuccess = false
    if (appToken) {
      try {
        // Check user exists
        await httpClient.getUserInfo(name)

        // Delete
        await httpClient.deleteUserFromPassword({
          name,
          password,
        })

        onlineSuccess = true
      } catch (e) {
        //
      }
    }

    if (!existsLocally && !onlineSuccess) {
      // Account not found
      setLoading(false)
      return false
    }

    if (appToken && !onlineSuccess) {
      // Account is saved online & online deletion failed - Dont delete locally
      setLoading(false)
      return false
    }

    // Online deletion success
    // Log out and delete all storage related to this user

    // Log out
    logOutUserRedux()
    // Delete local storage
    await Promise.all([
      removeAsyncStorageItem(`persist:${userId}`),
      deleteSecureValue(`username_${hash(name)}`),
      deleteSecureValue(`${userId}_encrypted_dek`),
      deleteSecureValue(`${userId}answer__encrypted_dek`),
      deleteSecureValue(`${userId}_hashed_dek`),
      deleteSecureValue(`${userId}_salt`),
      deleteSecureValue(`${userId}answer__salt`),
    ])
    // analytics
    analytics?.().logEvent('deleteAccount')
    setLoading(false)
    return true
  }
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
  userId: string,
  answer?: string,
  alt = 0,
) => {
  const suffix = alt ? `_${alt}` : ''
  const savedNameIdMapping = await setUserIdForName(name, userId)
  const salt = generateSalt()
  const savedSalt = await setSalt(userId, salt, suffix)
  const DEK = generateDEK()
  const KEK = deriveKEK(password, salt)
  const savedDEK = await setDEK(userId, DEK, KEK)

  if (answer) {
    const answerSalt = generateSalt()
    const savedAnswerSalt = await setSalt(userId, answerSalt, suffix, 'answer_')
    const answerKEK = deriveKEK(answer, answerSalt)
    const savedAnswerDEK = await setAnswerDEK(userId, DEK, answerKEK)

    if (!savedSalt || !savedAnswerSalt || !savedAnswerDEK) {
      return undefined
    }
  }

  if (!savedNameIdMapping || !savedSalt || !savedDEK) {
    return undefined
  }

  return DEK
}

export const localLogin = async ({
  name,
  password,
  isAnswer = false,
  alt = 0,
}: {
  name: string
  password: string
  isAnswer?: boolean
  alt?: number
}): Promise<{
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
  const prefix = isAnswer ? 'answer_' : ''
  const suffix = alt ? `_${alt}` : ''
  const salt = await getSalt(localUserId, suffix, prefix)

  if (!salt) {
    // No salt - Account unrecoverable
    return fail
  }

  const KEK = deriveKEK(password, salt)
  const DEK = await getDEK(localUserId, KEK, suffix, prefix)

  if (DEK === undefined) {
    // No DEK - Account unrecoverable
    return fail
  }

  const isValid = await validateDEK(localUserId, DEK)

  const maxAlts = 1
  if (!isValid && alt < maxAlts) {
    // Validation failed, check same password with alternate salt & DEK
    return localLogin({ name, password, alt: alt + 1 })
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
  const salt = await getSalt(userId, undefined, 'answer_')

  if (!salt) {
    return false
  }

  const KEK = deriveKEK(answer, salt)
  const DEK = await getDEK(userId, KEK, undefined, 'answer_')

  if (!DEK) {
    return false
  }

  // If no suffix, old eDEK is overwritten, old password invalidated
  const suffix = preserveOldPassword ? `_1` : ''
  const newSalt = generateSalt()
  const savedSalt = await setSalt(userId, newSalt, suffix)
  const newKEK = deriveKEK(newPassword, newSalt)
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

export const changeLocalAnswer = async (
  userId: string,
  oldAnswer: string,
  newAnswer: string,
  preserveOldAnswer: boolean,
) => {
  const salt = await getSalt(userId, undefined, 'answer_')

  if (!salt) {
    return false
  }

  const KEK = deriveKEK(oldAnswer, salt)
  const DEK = await getDEK(userId, KEK, undefined, 'answer_')

  if (!DEK) {
    return false
  }

  // If no suffix, old eDEK is overwritten, old password invalidated
  const suffix = preserveOldAnswer ? `_1` : ''
  const newSalt = generateSalt()
  const savedSalt = await setSalt(userId, newSalt, suffix)
  const newKEK = deriveKEK(newAnswer, newSalt)
  const savedDEK = await setDEK(userId, DEK, newKEK, suffix)

  return savedSalt && savedDEK
}

export const commitAltAnswer = async (userId: string, alt = 1) => {
  const suffix = `_${alt}`
  const altSalt = await getSalt(userId, suffix, 'answer_')
  const altEncryptedDEK = await getSecureValue(`${userId}_answer_encrypted_dek${suffix}`)

  if (!altSalt || !altEncryptedDEK) {
    return false
  }

  const savedSalt = await setSalt(userId, altSalt, 'answer_')
  const savedEncryptedDEK = await setSecureValue(`${userId}_answer_encrypted_dek`, altEncryptedDEK)

  if (!savedSalt || !savedEncryptedDEK) {
    return false
  }

  await deleteAltAnswer(userId, alt)
  return true
}

export const deleteAltAnswer = async (userId: string, alt = 1) => {
  const suffix = `_${alt}`
  await Promise.all([
    deleteSecureValue(`${userId}_answer_encrypted_dek${suffix}`),
    deleteSecureValue(`${userId}_answer_salt${suffix}`),
  ])
}

export const formatPassword = (password: string) => {
  return _.toLower(password).trim()
}

export const checkUserNameAvailability = async (name: string) => {
  const availableLocally = await checkNameAvailableLocally(name)

  if (!availableLocally) {
    return false
  }

  try {
    await httpClient.getUserInfo(name)
    return false
  } catch (err) {
    return true
  }
}
