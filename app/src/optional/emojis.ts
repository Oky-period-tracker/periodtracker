/* eslint-disable @typescript-eslint/no-var-requires */
import {
  EmojiQuestionOptions,
  EmojiTopicTexts,
  QuizStep,
} from '../screens/DayScreen/components/DayTracker/types'

let quizSteps: QuizStep[] = ['question ', 'mood', 'body', 'activity', 'flow', 'notes']

try {
  quizSteps = require('../resources/translations/emojis').quizSteps
} catch (e) {
  //
}

let emojiOptions: EmojiQuestionOptions = {
  mood: {
    happy: '😊',
    blah: '😑',
    sad: '😔',
    stressed: '😤',
    worried: '😟',
    fabulous: '😎',
  },
  body: {
    tired: '💤',
    cramps: '💥',
    bloating: '🎈',
    spots: '💢',
    headache: '⚡',
    sore_breasts: '🍒',
  },
  activity: {
    exercise: '🏃',
    'healthy food': '🍏',
    'good sleep': '🛏️',
    socialising: '👋',
    "couldn't sleep": '😴',
    'unhealthy food': '🍰',
  },
  flow: {
    none: '🌂',
    spotting: '🔹',
    light: '💧',
    medium: '💦',
    heavy: '☔',
  },
}

try {
  emojiOptions = require('../resources/translations/emojis').emojiOptions
} catch (e) {
  //
}

let offPeriodOptions = ['none', 'spotting']
let onPeriodOptions = ['light', 'medium', 'heavy']

try {
  offPeriodOptions = require('../resources/translations/emojis').offPeriodOptions
  onPeriodOptions = require('../resources/translations/emojis').onPeriodOptions
} catch (e) {
  //
}

let EmojiCardText: EmojiTopicTexts = {
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

try {
  EmojiCardText = require('../resources/translations/emojis').EmojiCardText
} catch (e) {
  //
}

export { quizSteps, emojiOptions, offPeriodOptions, onPeriodOptions, EmojiCardText }
