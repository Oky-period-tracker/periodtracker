import { AES, enc } from 'react-native-crypto-js'
import { sha256 } from 'js-sha256'
import _ from 'lodash'
import { StoreCredentials } from '../redux/reducers/accessReducer'

export const encrypt = (str: string, secret: string): string => {
  return AES.encrypt(str, secret).toString()
}

export const decrypt = (str: string, secret: string) => {
  const bytes = AES.decrypt(str, secret)
  const originalText = bytes.toString(enc.Utf8)
  return originalText
}

export const hash = (str: string) => {
  return sha256(str)
}

export const formatPassword = (password: string) => {
  // I don't agree with setting the password to lowercase but it has been like this for a long time, changing it now could lock out users
  return _.toLower(password).trim()
}

export const validatePassword = (password: string, minLength = 1) => {
  return formatPassword(password).length >= minLength
}

export const verifyStoreCredentials = ({
  username,
  password,
  storeCredentials,
  method = 'password',
}: {
  username: string
  password: string
  storeCredentials: StoreCredentials
  method?: 'password' | 'answer'
}): boolean => {
  if (!username || !password) {
    return false
  }

  const usernameHash = hash(username)
  const credential = storeCredentials[usernameHash]

  if (!credential) {
    return false
  }

  const formattedPassword = formatPassword(password)

  const salt = method === 'password' ? credential.passwordSalt : credential.answerSalt
  const verificationHash = method === 'password' ? credential.passwordHash : credential.answerHash

  const inputHash = hash(formattedPassword + salt)
  const passwordCorrect = inputHash === verificationHash

  return passwordCorrect
}
