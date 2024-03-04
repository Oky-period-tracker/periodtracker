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
  lang: string
  isAgeRestricted: string
  ageRestrictionLevel: number
  contentFilter: number
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
  ageRestrictionLevel: number
  contentFilter: number
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
  ageRestrictionLevel: number
  contentFilter: number
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
  province: any
}
export interface HelpCenterResponse extends Array<HelpCenterResponseItem> {}

export interface LoginResponse {
  appToken: string
  user: {
    id: string
    name: string
    dateOfBirth: string
    gender: 'Male' | 'Female' | 'Other'
    genderIdentity: 'Oo' | 'Hindi' | 'Other'
    isPwd: string
    accommodationRequirement?: string
    religion: string
    encyclopediaVersion: string
    isProfileUpdateSkipped?: boolean
    location: string
    city?: string
    country: string
    province: string
    secretQuestion: string
    secretAnswer: string
    dateSignedUp: string
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
    genderIdentity: 'Oo' | 'Hindi' | 'Other'
    isPwd: string
    accommodationRequirement?: string
    religion: string
    encyclopediaVersion: string
    city: string
    location: string
    country: string
    province: string
    secretQuestion: string
    secretAnswer: string
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

export interface HelpCenterAttributesResponse {
  id: number
  attributeName: string
  description: string
  isActive: boolean
}
