import { createAction } from '../helpers'

export function queueEvent(payload: { id: string; type: string; payload: any; metadata: any }) {
  return createAction('QUEUE_EVENT', payload)
}

export function resetQueue() {
  return createAction('RESET_QUEUE')
}
