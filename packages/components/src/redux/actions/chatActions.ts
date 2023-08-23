import { createAction } from '../helpers'
import { ChatMessage } from '../../types'

export function setupChat() {
  return createAction('SETUP_CHAT')
}

export function sendChatMessage(message: string) {
  return createAction('SEND_CHAT_MESSAGE', { message })
}

export function refreshChatMessages() {
  return createAction('REFRESH_CHAT_MESSAGES')
}

export function setChatContact(contact: string) {
  return createAction('SET_CHAT_CONTACT', { contact })
}

export function setChatMessages({
  messages,
  rules,
  isFlowRunning,
}: {
  messages: ChatMessage[]
  rules: string[]
  isFlowRunning: boolean
}) {
  return createAction('SET_CHAT_MESSAGES', { messages, rules, isFlowRunning })
}
