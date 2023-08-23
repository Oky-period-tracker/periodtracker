import { Token } from 'typedi'
import { AppEvent } from './AppEvent'

export interface AppEventRepository {
  appendEvents(appEvents: AppEvent[]): Promise<void>
}

export const AppEventRepositoryToken = new Token<AppEventRepository>()
