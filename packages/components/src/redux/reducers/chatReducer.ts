import { Actions } from '../types/index'
import { ChatMessage } from '../../types'

export interface ChatState {
  isReady: boolean
  isFlowRunning: boolean
  contact: string
  messages: ChatMessage[]
  ruleSet: string[]
}

const initialState: ChatState = {
  isReady: false,
  isFlowRunning: false,
  contact: null,
  messages: [],
  ruleSet: [],
}

export function chatReducer(state = initialState, action: Actions): ChatState {
  switch (action.type) {
    case 'SETUP_CHAT':
      return initialState

    case 'SET_CHAT_CONTACT':
      return {
        ...state,
        contact: action.payload.contact,
      }

    case 'SET_CHAT_MESSAGES':
      return {
        ...state,
        isReady: true,
        messages: action.payload.messages,
        ruleSet: action.payload.rules,
        isFlowRunning: action.payload.isFlowRunning,
      }

    default:
      return state
  }
}
