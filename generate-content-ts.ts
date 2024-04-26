import fs from 'fs'

import {
  fromAvatarMessages,
  fromDidYouKnows,
  fromEncyclopedia,
  fromHelpCenters,
  fromQuizzes,
} from '@oky/core/src'
import { logger } from './logger'

/* 
    This is for generating content .ts files via the JSON returned from the cms endpoints
    Send requests to the endpoints, copy paste the data into the file, ensure the locale value is correct.
    
    Execute this via the terminal:
    npx ts-node --transpile-only generate-content-ts.ts
*/

const locale = 'en'

// /mobile/articles/:locale
const encyclopediaRaw: any = []

// /mobile/quizzes/:locale
const quizzesRaw = []

// /mobile/didyouknows/:locale
const didYouKnowsRaw = []

// /mobile/help-center/:locale
const helpCentersRaw = []

// /mobile/avatar-messages/:locale
const avatarMessagesRaw = []

const { articles, categories, subCategories } = fromEncyclopedia({
  encyclopediaResponse: encyclopediaRaw,
})
const { quizzes } = fromQuizzes(quizzesRaw)
const { didYouKnows } = fromDidYouKnows(didYouKnowsRaw)
const { helpCenters } = fromHelpCenters(helpCentersRaw)
const { avatarMessages } = fromAvatarMessages(avatarMessagesRaw)

// /mobile/privacy-policy/:locale
const privacyPolicy = []

// /mobile//terms-and-conditions/:locale
const termsAndConditions = []

// /mobile/about/:locale
const about = []

// /mobile/about-banner/:locale
const aboutBanner = ''

const fileContent = `
    export const ${locale} = {
      locale: '${locale}',
      categories: ${JSON.stringify(categories)},
      subCategories: ${JSON.stringify(subCategories)},
      articles: ${JSON.stringify(articles)},
      quizzes: ${JSON.stringify(quizzes)},
      didYouKnows: ${JSON.stringify(didYouKnows)},
      helpCenters: ${JSON.stringify(helpCenters)},
      avatarMessages: ${JSON.stringify(avatarMessages)},
      privacyPolicy: ${JSON.stringify(privacyPolicy)},
      termsAndConditions: ${JSON.stringify(termsAndConditions)},
      about: ${JSON.stringify(about)},
      aboutBanner: '${aboutBanner}',
    }
`

fs.writeFileSync(`${locale}.ts`, fileContent)

logger(`Successfully generated file: ${locale}.ts`)
