import _ from 'lodash'

export const formatPassword = (password: string) => {
  return _.toLower(password).trim()
}
