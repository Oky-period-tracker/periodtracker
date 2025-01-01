import { EmojiQuestionOptions, EmojiTopicTexts, QuizStep } from './types'

export const quizSteps: QuizStep[] = ['question ', 'mood', 'body', 'activity', 'flow', 'notes']

export const emojiOptions: EmojiQuestionOptions = {
  mood: {
    happy: '😊',
    proud: '😎',
    loved: '🥰',
    sad: '😔',
    stressed: '😤',
    worried: '😟',
    fabulous: '🤩',
    swings: '😕',
    confused: '🤔',
  },
  body: {
    tired: '💤',
    cramps: '💥',
    bloating: '💨',
    pimples: '🍊',
    headache: '🤯',
    sore_breasts: '👙',
    energetic: '🔋',
    hungry: '🍳',
    backpain: '🌡️',
  },
  activity: {
    exercise: '🏃',
    'healthy food': '🥗',
    'good sleep': '🛏️',
    socialising: '👋',
    "couldn't sleep": '😴',
    'unhealthy food': '🍰',
    reading: '📖',
    social_media: '📱',
    jog: '🚶‍♀️',
  },
  flow: {
    none: '🌂',
    spotting: '🔹',
    light: '💧',
    medium: '💦',
    heavy: '☔',
    super_heavy: '🌊',
  },
}

export const offPeriodOptions = ['none', 'spotting']
export const onPeriodOptions = ['light', 'medium', 'heavy', 'super_heavy']

export const EmojiCardText: EmojiTopicTexts = {
  mood: {
    title: 'mood',
    description: 'daily_mood_content',
    question: 'daily_mood_heading',
  },
  body: {
    title: 'body',
    description: 'daily_body_content',
    question: 'daily_body_heading',
  },
  activity: {
    title: 'activity',
    description: 'daily_activity_content',
    question: 'daily_activity_heading',
  },
  flow: {
    title: 'flow',
    description: 'daily_flow_content',
    question: 'daily_flow_heading',
  },
}
