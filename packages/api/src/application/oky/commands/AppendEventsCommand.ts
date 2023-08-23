export interface AppendEventsCommand {
  userId: string | null
  events: Array<{
    localId: string
    type: string
    payload: any
    metadata: any
  }>
}
