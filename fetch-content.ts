import fs from 'fs'
import {
  fromAvatarMessages,
  fromDidYouKnows,
  fromEncyclopedia,
  fromHelpCenters,
  fromQuizzes,
} from '@oky/core'

/* 
  This is for fetching data from an old CMS and generating a .ts file from that.
  I ran the requests manually in the browser, this script could be improved by programaticaly sending all the requests 
*/

// const cmsUrl = ''
const locale = ''

// /mobile/articles/${locale}
const encyclopediaResponse = []

// /mobile/privacy-policy/${locale}
const privacyPolicy = []

// /mobile/terms-and-conditions/${locale}
const termsAndConditions = []

// /mobile/about/${locale}
const about = []

// /mobile/help-center/${locale}
const helpCenterResponse = []

// /mobile/quizzes/${locale}
const quizzesResponse = []

// /mobile/didyouknows/${locale}
const didYouKnowsResponse = []

// /mobile/avatar-messages/${locale}
const avatarMessagesResponse = []

const { articles, categories, subCategories, videos } = fromEncyclopedia({
  // @ts-ignore
  encyclopediaResponse,
  videosResponse: [],
})
const { helpCenters } = fromHelpCenters(helpCenterResponse)
const { quizzes } = fromQuizzes(quizzesResponse)
const { didYouKnows } = fromDidYouKnows(didYouKnowsResponse)
const { avatarMessages } = fromAvatarMessages(avatarMessagesResponse)

const fileContent = `
// THIS FILE IS AUTO GENERATED. DO NOT EDIT MANUALLY
import { StaticContent } from '../../../types'

export const ${locale}: StaticContent = {
  locale: '${locale}',
  categories: ${JSON.stringify(categories)},
  subCategories: ${JSON.stringify(subCategories)},
  articles: ${JSON.stringify(articles)},
  quizzes: ${JSON.stringify(quizzes)},
  didYouKnows: ${JSON.stringify(didYouKnows)},
  helpCenters: ${JSON.stringify(helpCenters)},
  avatarMessages: ${JSON.stringify(avatarMessages)},
  privacyPolicy: ${privacyPolicy},
  termsAndConditions: ${termsAndConditions},
  about: ${about},
  aboutBanner: '',
}
`

const fileName = `${locale}.ts`

fs.writeFileSync(fileName, fileContent)
