export interface UserMetadata {
  accommodationRequirement?: string
  religion?: string
  contentSelection?: number
  city?: string
}

export interface EncyclopediaResponseItem {
  id: string
  cat_id: string
  category_title: string
  subcategory_title: string
  subcat_id: string
  article_heading: string
  article_text: string
  primary_emoji: string
  primary_emoji_name: string
  contentFilter?: number
  isAgeRestricted?: boolean
  ageRestrictionLevel?: number
  voiceOverKey?: string | null
  lang: string
  live: boolean
}
export interface EncyclopediaResponse extends Array<EncyclopediaResponseItem> {}

export interface VideosResponseItem {
  id: string
  title: string
  youtubeId: string | null
  assetName: string | null
  parent_category: string
  live: boolean
}

export interface VideosResponse extends Array<VideosResponseItem> {}

interface QuizResponseItem {
  id: string
  isAgeRestricted: boolean
  topic?: string
  question: string
  option1: string
  option2: string
  option3: string
  right_answer: string
  wrong_answer_response: string
  right_answer_response: string
  lang: string
  live: boolean
}
export interface QuizzesResponse extends Array<QuizResponseItem> {}

interface SurveyResponseItem {
  id: string
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  option5: string
  response: string
  lang: string
}
export interface SurveysResponse extends Array<SurveyResponseItem> {}

interface AvatarMessagesResponseItem {
  id: string
  content: string
  lang: string
  live: boolean
}
export interface AvatarMessagesResponse extends Array<AvatarMessagesResponseItem> {}

interface DidYouKnowResponseItem {
  id: string
  isAgeRestricted: boolean
  title: string
  content: string
  lang: string
  live: boolean
}
export interface DidYouKnowsResponse extends Array<DidYouKnowResponseItem> {}

interface HelpCenterResponseItem {
  id: number
  title: string
  caption: string
  contactOne: string
  contactTwo: string
  address: string
  website: string
  lang: string
}
export interface HelpCenterResponse extends Array<HelpCenterResponseItem> {}

export interface LoginResponse {
  appToken: string
  user: {
    id: string
    name: string
    dateOfBirth: string
    gender: 'Male' | 'Female' | 'Other'
    location: string
    country: string
    province: string
    secretQuestion: string
    secretAnswer: string
    dateSignedUp: string
    metadata: UserMetadata
  }
  store: {
    storeVersion: number
    appState: any
  } | null
}

export interface SignupResponse {
  appToken: string
  user: {
    id: string
    name: string
    dateOfBirth: string
    gender: 'Male' | 'Female' | 'Other'
    location: string
    country: string
    province: string
    secretQuestion: string
    secretAnswer: string
    metadata: UserMetadata
  }
}

export interface ReplaceStoreResponse {
  userId: string
  storeVersion: number
  appState: any
}

export interface UserInfoResponse {
  id: string
  secretQuestion: string
}
export interface PermanentAlertResponse {
  message: string
  isPermanent: boolean
}
interface ContentItem {
  type: 'HEADING' | 'CONTENT'
  content: string
}
export interface PrivacyResponse extends Array<ContentItem> {}
export interface TermsAndConditionsResponse extends Array<ContentItem> {}
export interface AboutResponse extends Array<ContentItem> {}

export type AboutBannerResponse = string // @deprecated

export type AboutBannerConditionalResponse =
  | {
      shouldUpdate: true
      timestamp: number
      aboutBanner: string
    }
  | {
      shouldUpdate: false
    }
