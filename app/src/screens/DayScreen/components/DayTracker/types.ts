export type QuizStep = string | 'question ' | 'mood' | 'body' | 'activity' | 'flow' | 'notes'

export type EmojiQuestionOptions = {
  mood: Record<string, string>
  body: Record<string, string>
  activity: Record<string, string>
  flow: Record<string, string>
}

export type EmojiQuestionsState = {
  mood?: string[]
  body?: string[]
  activity?: string[]
  flow?: string[]
}

export type EmojiTopicTextOptions = {
  title: string
  description: string
  question: string
}

export type EmojiTopicTexts = {
  mood: EmojiTopicTextOptions
  body: EmojiTopicTextOptions
  activity: EmojiTopicTextOptions
  flow: EmojiTopicTextOptions
}
