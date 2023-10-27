import { Service, Inject } from 'typedi'

import { AppEvent } from 'domain/oky/AppEvent'
import { AppEventRepositoryToken, AppEventRepository } from 'domain/oky/AppEventRepository'

import { AppendEventsCommand } from './commands/AppendEventsCommand'

@Service()
export class AnalyticsApplicationService {
  private appEventRepository: AppEventRepository

  constructor(@Inject(AppEventRepositoryToken) appEventRepository: AppEventRepository) {
    this.appEventRepository = appEventRepository
  }

  public async appendEvents({ userId, events }: AppendEventsCommand) {
    const appEvents = events.map((event) => {
      return AppEvent.fromData(userId, {
        localId: event.localId,
        type: event.type,
        payload: event.payload,
        metadata: event.metadata,
      })
    })

    return this.appEventRepository.appendEvents(appEvents)
  }
}
