import * as actions from '../actions'
import { ActionsUnion, ActionsOfType } from './types'

//@ts-expect-error TODO:
export type Actions = ActionsUnion<typeof actions>

export type ActionTypes = Actions[keyof Actions]

export type ExtractActionFromActionType<
  ActionType extends string
> = ActionsOfType<Actions, ActionType>
