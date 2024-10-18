import { createAction } from '../../helpers'

export const editUserName = (name: string) => {
  return createAction('EDIT_USER_NAME', name)
}
