import { AnalyticsApplicationService } from '../../../src/application/oky/AnalyticsApplicationService'
import { AppEventRepository } from '../../../src/domain/oky/AppEventRepository'
import { AppEvent } from '../../../src/domain/oky/AppEvent'
import { AppendEventsCommand } from '../../../src/application/oky/commands/AppendEventsCommand'

// Create a mock implementation
const mockAppendEvents = jest.fn()

// Create the mock repository object
const mockAppEventRepository: Partial<AppEventRepository> = {
  appendEvents: mockAppendEvents,
}

describe('AnalyticsApplicationService', () => {
  let service: AnalyticsApplicationService

  beforeEach(() => {
    // Explicitly cast mock object to the required type
    service = new AnalyticsApplicationService(mockAppEventRepository as AppEventRepository)
  })

  it('should append events correctly', async () => {
    // Arrange
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

    // Act
    await service.appendEvents(command)

    // Assert
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
