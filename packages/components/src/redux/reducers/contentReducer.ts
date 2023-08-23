import _ from 'lodash'
import {
  Articles,
  Categories,
  SubCategories,
  Surveys,
  Quizzes,
  DidYouKnows,
  HelpCenters,
  AvatarMessages,
  PrivacyPolicy,
  TermsAndConditions,
  About,
  AllSurveys,
  CompletedSurveys,
} from '../../types'
import { Actions } from '../types/index'

export interface ContentState {
  articles: Articles
  categories: Categories
  subCategories: SubCategories
  surveys: Surveys
  quizzes: Quizzes
  didYouKnows: DidYouKnows
  helpCenters: HelpCenters
  avatarMessages: AvatarMessages
  privacyPolicy: PrivacyPolicy
  termsAndConditions: TermsAndConditions
  about: About
  aboutBanner: string
  allSurveys: AllSurveys
  completedSurveys: CompletedSurveys
}

const initialState: ContentState = {
  articles: {
    byId: {},
    allIds: [],
  },
  categories: {
    byId: {},
    allIds: [],
  },
  subCategories: {
    byId: {},
    allIds: [],
  },
  surveys: {
    date_created: '',
    id: 'string',
    isAgeRestricted: false,
    is_multiple: true,
    lang: 'string',
    live: true,
    option1: 'string',
    option2: 'string',
    option3: 'string',
    option4: 'string',
    option5: 'string',
    question: 'string',
    questions: [],
  },
  allSurveys: [],
  completedSurveys: [],
  quizzes: {
    byId: {},
    allIds: [],
  },
  didYouKnows: {
    byId: {},
    allIds: [],
  },
  helpCenters: [],
  avatarMessages: [],
  privacyPolicy: [],
  termsAndConditions: [],
  about: [],
  aboutBanner: '',
}

export function contentReducer(state = initialState, action: Actions): ContentState {
  switch (action.type) {
    case 'INIT_STALE_CONTENT':
      return { ...action.payload }
    case 'FETCH_CONTENT_SUCCESS':
      return {
        ...state,
        articles: action.payload.articles,
        categories: action.payload.categories,
        subCategories: action.payload.subCategories,
        // surveys: {
        //   byId: {},
        //   allIds: [],
        // },
        // surveys:[],
        quizzes: action.payload.quizzes,
        didYouKnows: action.payload.didYouKnows,
        helpCenters: action.payload.helpCenters,
        avatarMessages: action.payload.avatarMessages,
        privacyPolicy: action.payload.privacyPolicy,
        termsAndConditions: action.payload.termsAndConditions,
        about: action.payload.about,
        aboutBanner: action.payload.aboutBanner,
      }
    case 'FETCH_SURVEY_CONTENT_SUCCESS':
      return {
        ...state,
        surveys: action.payload.surveys,
      }
    case 'UPDATE_ALL_SURVEYS_CONTENT':
      return {
        ...state,
        allSurveys: action.payload.allSurveys,
      }
    case 'UPDATE_COMPLETED_SURVEYS':
      return {
        ...state,
        completedSurveys: action.payload.completedSurveys,
      }
    default:
      return state
  }
}
