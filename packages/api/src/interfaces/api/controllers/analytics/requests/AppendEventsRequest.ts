import { IsNotEmpty, IsArray } from 'class-validator'

export class AppendEventsRequest {
  @IsNotEmpty()
  @IsArray()
  public readonly events: any[]

  public getEvents() {
    return this.events.map(event => {
      const { id: localId, ...rest } = event

      return {
        localId,
        ...rest,
      }
    })
  }
}
