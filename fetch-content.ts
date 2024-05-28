import fs from 'fs'
import {
  fromAvatarMessages,
  fromDidYouKnows,
  fromEncyclopedia,
  fromHelpCenters,
  fromQuizzes,
} from '@oky/core'
import axios from 'axios'

/* 
  This is for fetching data from an old CMS and generating a .ts file from that.
*/

const cmsUrl = 'cms.example.com'
const locale = 'en'

const endpoints = [
  `/mobile/articles/${locale}`,
  `/mobile/privacy-policy/${locale}`,
  `/mobile/terms-and-conditions/${locale}`,
  `/mobile/about/${locale}`,
  `/mobile/help-center/${locale}`,
  `/mobile/quizzes/${locale}`,
  `/mobile/didyouknows/${locale}`,
  `/mobile/avatar-messages/${locale}`,
]

const fetchData = async () => {
  const promises = endpoints.map(async (endpoint) => {
    const response = await axios.get(`${cmsUrl}${endpoint}`)
    return response.data
  })

  const responses = await Promise.all(promises)

  const [
    encyclopediaResponse,
    privacyPolicy,
    termsAndConditions,
    about,
    helpCenterResponse,
    quizzesResponse,
    didYouKnowsResponse,
    avatarMessagesResponse,
  ] = responses

  const { articles, categories, subCategories, videos } = fromEncyclopedia({
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
    videos: ${JSON.stringify(videos)},
    quizzes: ${JSON.stringify(quizzes)},
    didYouKnows: ${JSON.stringify(didYouKnows)},
    helpCenters: ${JSON.stringify(helpCenters)},
    avatarMessages: ${JSON.stringify(avatarMessages)},
    privacyPolicy: ${JSON.stringify(privacyPolicy)},
    termsAndConditions: ${JSON.stringify(termsAndConditions)},
    about: ${JSON.stringify(about)},
    aboutBanner: '',
  }
  `

  const fileName = `${locale}.ts`

  fs.writeFileSync(fileName, fileContent)
}

fetchData()
