import { commonActions } from '../actions'
import { ActionsUnion, ActionsOfType } from './types'

export type Actions = ActionsUnion<typeof commonActions>

export type ActionTypes = Actions[keyof Actions]

export type ExtractActionFromActionType<ActionType extends string> = ActionsOfType<
  Actions,
  ActionType
>
