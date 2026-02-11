import {
  EmojiQuestionOptions,
  EmojiTopicTexts,
  QuizStep,
} from '../../screens/DayScreen/components/DayTracker/types'

export const quizSteps: QuizStep[] = ['question ', 'mood', 'body', 'activity', 'flow', 'notes']

export const emojiOptions: EmojiQuestionOptions = {
  mood: {
    good: '😎',
    happy: '😊',
    blah: '😑',
    sad: '😔',
    stressed: '😤',
    worried: '😟',
    fabulous: '😎',
    lazy: '🥱',
    iritable: '😒',
    angry: '😡',
  },
  body: {
    tired: '💤',
    cramps: '💥',
    bloating: '🎈',
    spots: '💢',
    headache: '⚡',
    sore_breasts: '🍒',
    bloated: '💨',
    back_pain: '🏋🏽‍♀️',
    okay: '👌🏽',
  },
  activity: {
    'healthy food': '🍏',
    'good sleep': '🛏️',
    "couldn't sleep": '😴',
    'unhealthy food': '🍰',
    exercise: '🏃‍♀️',
    socialising: '👋',
    music: '🎧',
    study: '📖',
    video: '🍿',
  },
  flow: {
    none: '🌂',
    light: '💧',
    medium: '💦',
    heavy: '☔',
    spotting: '🔹',
    torrential: '🔹',
  },
}

export const offPeriodOptions = ['none', 'spotting']
export const onPeriodOptions = ['light', 'medium', 'heavy']

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
