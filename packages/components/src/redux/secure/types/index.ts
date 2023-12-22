import { secureActions } from '../actions'
import { ActionsUnion, ActionsOfType } from '../../types'

export type SecureActions = ActionsUnion<typeof secureActions>

export type SecureActionTypes = SecureActions[keyof SecureActions]

export type ExtractActionFromActionType<ActionType extends string> = ActionsOfType<
  SecureActions,
  ActionType
>
