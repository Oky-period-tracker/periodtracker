import { generateRange } from '../services/utils'

export const locations = [
  { value: 'Urban', label: 'Urban', iconName: 'building' },
  { value: 'Rural', label: 'Rural', iconName: 'leaf' },
]

const now = new Date()
const currentYear = now.getFullYear()
const years = generateRange(currentYear - 7, currentYear - 100).map((item) => item.toString())

export const yearOptions = years.map((item) => ({ label: item, value: item }))

export const secretQuestions = [
  // "secret_question",
  `favourite_actor`,
  `favourite_teacher`,
  `childhood_hero`,
]

export const questionOptions = secretQuestions.map((item) => ({
  label: item,
  value: item,
}))

export const defaultEmoji = '💁‍♀️'

const reasons = [
  // "reason",
  'report_bug',
  'request_topic',
  'Other',
  'problem_app',
]

export const reasonOptions = reasons.map((item) => ({
  label: item,
  value: item,
}))
