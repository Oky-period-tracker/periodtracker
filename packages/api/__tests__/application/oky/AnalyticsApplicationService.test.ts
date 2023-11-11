import { AnalyticsApplicationService } from '../../../src/application/oky/AnalyticsApplicationService'
import { AppEventRepository } from '../../../src/domain/oky/AppEventRepository'
import { AppEvent } from '../../../src/domain/oky/AppEvent'
import { AppendEventsCommand } from '../../../src/application/oky/commands/AppendEventsCommand'

const mockAppendEvents = jest.fn()

const mockAppEventRepository: Partial<AppEventRepository> = {
  appendEvents: mockAppendEvents,
}

describe('AnalyticsApplicationService', () => {
  let service: AnalyticsApplicationService

  beforeEach(() => {
    service = new AnalyticsApplicationService()
    service.setRepository(mockAppEventRepository as AppEventRepository)
  })

  it('should append events correctly', async () => {
    const command: AppendEventsCommand = {
      userId: 'user1',
      events: [
        {
          localId: 'local1',
          type: 'type1',
          payload: {},
          metadata: {},
        },
      ],
    }

    await service.appendEvents(command)

    expect(mockAppendEvents).toBeCalled()

    const expectedAppEvent = AppEvent.fromData('user1', {
      localId: 'local1',
      type: 'type1',
      payload: {},
      metadata: {},
    })

    expect(mockAppendEvents).toBeCalledWith([expectedAppEvent])
  })
})
