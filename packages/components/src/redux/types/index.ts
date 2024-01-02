import { commonActions } from '../actions'
import { ActionsUnion, ActionsOfType } from './types'

export type CommonActions = ActionsUnion<typeof commonActions>

export type CommonActionTypes = CommonActions[keyof CommonActions]

export type ExtractActionFromActionType<ActionType extends string> = ActionsOfType<
  CommonActions,
  ActionType
>
