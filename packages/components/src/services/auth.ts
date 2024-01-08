import { sha256 } from 'js-sha256'
import _ from 'lodash'

export const hash = (str: string) => {
  return sha256(str)
}

export const formatPassword = (password: string) => {
  // I don't agree with setting the password to lowercase but it has been like this for a long time, changing it now could lock out users
  return _.toLower(password).trim()
}
