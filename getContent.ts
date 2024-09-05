import fs from 'fs'

import {
  fromAvatarMessages,
  fromDidYouKnows,
  fromEncyclopedia,
  fromHelpCenters,
  fromQuizzes,
} from '@oky/core'
import { StaticContent } from './app/src/core/types'

const locale = 'en'

// /mobile/articles/en
const encyclopediaResponse = []

// /mobile/videos/en
const videosResponse = []

// /mobile/privacy-policy/en
const privacyPolicy = []

// /mobile/terms-and-conditions/en
const termsAndConditions = []

// /mobile/about/en
const about = []

//
const timestamp = 0

// /mobile/about-banner/en
const aboutBanner = []

// /mobile/help-center/en
const helpCenterResponse = []

// /mobile/help-center-attribute/en
const helpCenterAttributesResponse = []

// /mobile/quizzes/en
const quizzesResponse = []

// /mobile/didyouknows/en
const didYouKnowsResponse = []

// /mobile/avatar-messages/en
const avatarMessagesResponse = []

const { articles, categories, subCategories, videos } = fromEncyclopedia({
  encyclopediaResponse,
  videosResponse,
})

const { quizzes } = fromQuizzes(quizzesResponse)
const { didYouKnows } = fromDidYouKnows(didYouKnowsResponse)
const { helpCenters } = fromHelpCenters(helpCenterResponse)
const helpCenterAttributes = helpCenterAttributesResponse
const { avatarMessages } = fromAvatarMessages(avatarMessagesResponse)

const result: StaticContent = {
  locale,
  articles,
  categories,
  subCategories,
  quizzes,
  didYouKnows,
  helpCenters,
  helpCenterAttributes,
  avatarMessages,
  privacyPolicy,
  termsAndConditions,
  about,
  allSurveys: [],
  completedSurveys: [],
  //   aboutBanner: string,
  videos,
}

const outputFilepath = `${locale}.ts`

const outputString = `
import { StaticContent } from '../../../core/types'

export const ${locale}: StaticContent = ${JSON.stringify(result)}`

fs.writeFileSync(outputFilepath, outputString)
