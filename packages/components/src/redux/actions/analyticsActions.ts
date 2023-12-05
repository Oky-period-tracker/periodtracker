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

export function logScreenView(payload: { screenName: string }) {
  return createAction('SCREEN_VIEWED', payload)
}

export function logCategoryView(payload: { categoryId: string }) {
  return createAction('CATEGORY_VIEWED', payload)
}

export function logSubCategoryView(payload: { subCategoryId: string }) {
  return createAction('SUBCATEGORY_VIEWED', payload)
}

export function logDailyCardUse(payload: { userId: string }) {
  return createAction('DAILY_CARD_USED', payload)
}
