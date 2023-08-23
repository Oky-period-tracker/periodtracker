import { createAction } from '../helpers'

export function queueEvent({
  id,
  type,
  payload,
  metadata,
}: {
  id: string
  type: string
  payload: any
  metadata: any
}) {
  return createAction('QUEUE_EVENT', { id, type, payload, metadata })
}

export function resetQueue() {
  return createAction('RESET_QUEUE')
}
