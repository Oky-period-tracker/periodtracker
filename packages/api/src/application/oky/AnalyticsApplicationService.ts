import { Service, Inject } from 'typedi'

import { AppEvent } from 'domain/oky/AppEvent'
import { AppEventRepositoryToken, AppEventRepository } from 'domain/oky/AppEventRepository'

import { AppendEventsCommand } from './commands/AppendEventsCommand'

@Service()
export class AnalyticsApplicationService {
  @Inject(AppEventRepositoryToken)
  private appEventRepository: AppEventRepository

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

  public setRepository(repository: AppEventRepository): void {
    this.appEventRepository = repository
  }
}
