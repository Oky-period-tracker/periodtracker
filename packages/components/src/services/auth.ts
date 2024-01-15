import { sha256 } from 'js-sha256'
import _ from 'lodash'
import { StoreCredentials } from '../redux/reducers/accessReducer'

export const hash = (str: string) => {
  return sha256(str)
}

export const formatPassword = (password: string) => {
  // I don't agree with setting the password to lowercase but it has been like this for a long time, changing it now could lock out users
  return _.toLower(password).trim()
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
  const passwordHash = hash(formattedPassword + credential.passwordSalt)
  const verificationHash = method === 'password' ? credential.passwordHash : credential.answerHash
  const passwordCorrect = passwordHash === verificationHash

  return passwordCorrect
}
