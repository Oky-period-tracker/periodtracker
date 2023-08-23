export interface ChatMessage {
  id: string
  direction: 'out' | 'in'
  text: string
  sentAt: string
}
