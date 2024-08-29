export type Activity = 'exercise' | 'healthy-food' | 'good-sleep' | 'socialising'

export type Body = 'tired' | 'cramps' | 'bloating' | 'spots'

export type Flow = 'none' | 'light' | 'medium' | 'heavy' | 'spotting'

export type Mood = 'happy' | 'blah' | 'sad' | 'stressed'

export type CardName = keyof DailyCard

export interface DailyCard {
  activity?: Activity
  body?: Body
  flow?: Flow
  mood?: Mood
  periodDay: null | boolean
}
