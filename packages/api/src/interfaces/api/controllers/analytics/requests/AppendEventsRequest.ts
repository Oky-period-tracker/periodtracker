import { IsNotEmpty, IsArray } from 'class-validator'

const eventsToIgnore = [
  'USER_SET_FUTURE_PREDICTION_STATE_ACTIVE',
  'SCREEN_VIEWED',
  'CATEGORY_VIEWED',
  'SUBCATEGORY_VIEWED',
  'DAILY_CARD_USED',
]

export class AppendEventsRequest {
  @IsNotEmpty()
  @IsArray()
  public readonly events: any[]

  public getEvents() {
    return this.events
      .filter((event) => !eventsToIgnore.includes(event.type)) // Stop saving these events to the DB
      .map((event) => {
        const { id: localId, ...rest } = event

        return {
          localId,
          ...rest,
        }
      })
  }
}
