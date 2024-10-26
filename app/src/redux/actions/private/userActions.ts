import { User } from '../../../types'
import { createAction } from '../../helpers'

export const initUser = (payload: { user: User; appToken: string | null }) => {
  return createAction('INIT_USER', payload)
}
