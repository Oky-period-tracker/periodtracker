import * as actions from '../actions'
import { ActionsUnion, ActionsOfType } from './types'

export type Actions = ActionsUnion<typeof actions>

export type ActionTypes = Actions[keyof Actions]

export type ExtractActionFromActionType<
  ActionType extends string
> = ActionsOfType<Actions, ActionType>
