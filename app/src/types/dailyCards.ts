export type Activity = 'exercise' | 'healthy-food' | 'good-sleep' | 'socialising'

export type Body =
  | 'tired'
  | 'cramps'
  | 'bloating'
  | 'pimples'
  | 'headache'
  | 'sore_breasts'
  | 'energetic'
  | 'hungry'
  | 'backpain'

export type Flow = 'none' | 'light' | 'medium' | 'heavy' | 'spotting'

export type Mood =
  | 'happy'
  | 'loved'
  | 'sad'
  | 'stressed'
  | 'proud'
  | 'swings'
  | 'fabulous'
  | 'confused'
  | 'worried'

export type CardName = keyof DailyCard

export interface DailyCard {
  activity?: Activity
  body?: Body
  flow?: Flow
  mood?: Mood
  periodDay: null | boolean
}
