interface Articles {
  byId: {
    [id: string]: {
      id: string
      title: string
      content: string
      category: string
      subCategory: string
      live?: boolean
    }
  }
  allIds: string[]
}

interface AvatarMessageItem {
  id: string
  content: string
  live?: boolean
}
interface AvatarMessages extends Array<AvatarMessageItem> {}

interface Categories {
  byId: {
    [id: string]: {
      id: string
      name: string
      tags: {
        primary: {
          name: string
          emoji: string
        }
        secondary?: {
          name: string
          emoji: string
        }
      }
      subCategories: string[]
    }
  }
  allIds: string[]
}

interface SubCategories {
  byId: {
    [id: string]: {
      id: string
      name: string
      articles: string[]
    }
  }
  allIds: string[]
}

interface DidYouKnows {
  byId: {
    [id: string]: {
      id: string
      isAgeRestricted: boolean
      title: string
      content: string
      live?: boolean
    }
  }
  allIds: string[]
}

interface Quiz {
  id: string
  isAgeRestricted: boolean
  topic: string
  question: string
  answers: Array<{
    text: string
    emoji: string
    isCorrect: boolean
  }>
  response: {
    correct: string
    in_correct: string
  }
  live?: boolean
}

interface Quizzes {
  byId: {
    [id: string]: Quiz
  }
  allIds: string[]
}

interface Surveys {
  date_created: string
  id: string
  isAgeRestricted: false
  is_multiple: true
  lang: string
  live: true
  option1: string
  option2: string
  option3: string
  option4: string
  option5: string
  question: string
  questions: ContentItem[]
}

interface SurveyContentItem {
  date_created: string
  id: string
  isAgeRestricted: false
  is_multiple: true
  lang: string
  live: true
  option1: string
  option2: string
  option3: string
  option4: string
  option5: string
  question: string
  questions: SurveyQuestionContentItem[]
  inProgress: boolean
  currentQuestionIndex: number
  answeredQuestion: AnsweredSurveyQuestionContentItem[]
}
interface SurveyQuestionContentItem {
  id: string
  is_multiple: boolean
  next_question: ContentItem
  options: ContentItem[]
  question: string
  response: string
  sort_number: string
  surveyId: string
  answeredQuestion: AnsweredSurveyQuestionContentItem
}

interface AnsweredSurveyQuestionContentItem {
  questionId: string
  question: string
  answerID: string
  answer: string
  response: string
  isMultiple: boolean
}
interface AllSurveys extends Array<SurveyContentItem> {}
interface CompletedSurveys extends Array<CompletedSurveyItem> {}
interface CompletedSurveyItem {
  id: string
}

interface HelpCenterItem {
  id: number
  title: string
  caption: string
  contactOne: string
  contactTwo?: string
  address: string
  website: string
  lang: string
}
interface HelpCenters extends Array<HelpCenterItem> {}

interface ContentItem {
  type: 'HEADING' | 'CONTENT'
  content: string
}

interface PrivacyPolicy extends Array<ContentItem> {}
interface TermsAndConditions extends Array<ContentItem> {}
interface About extends Array<ContentItem> {}

// TODO_SURVEY fix type overlap with /components !

export interface StaticContent {
  locale: string
  articles: Articles
  categories: Categories
  subCategories: SubCategories
  quizzes: Quizzes
  didYouKnows: DidYouKnows
  helpCenters: HelpCenters
  avatarMessages: AvatarMessages
  privacyPolicy: PrivacyPolicy
  termsAndConditions: TermsAndConditions
  about: About
  aboutBanner: string
}
