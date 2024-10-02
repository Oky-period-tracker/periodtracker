import axios from 'axios'

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
const cms_url = 'https://cms.okyapp.info/'

const getContent = async () => {
  console.log(`Locale: ${locale}`)
  console.log(`CMS: ${cms_url}\n`)

  // Encyclopedia
  let encyclopediaResponse = []
  const encyclopediaUrl = `${cms_url}mobile/articles/${locale}`
  try {
    console.log('Fetching Encyclopedia')
    const response = await axios.get(encyclopediaUrl)
    encyclopediaResponse = response.data
  } catch (error) {
    console.error(`Request failed: ${encyclopediaUrl}`)
  }

  // Videos
  let videosResponse = []
  const videosUrl = `${cms_url}mobile/videos/${locale}`
  try {
    console.log('Fetching Videos')
    const response = await axios.get(videosUrl)
    videosResponse = response.data
  } catch (error) {
    console.error(`Request failed: ${videosUrl}`)
  }

  // Privacy policy
  let privacyPolicy = []
  const privacyUrl = `${cms_url}mobile/privacy-policy/${locale}`
  try {
    console.log('Fetching Privacy policy')
    const response = await axios.get(privacyUrl)
    privacyPolicy = response.data
  } catch (error) {
    console.error(`Request failed: ${privacyUrl}`)
  }

  // Terms and conditions
  let termsAndConditions = []
  const termsUrl = `${cms_url}mobile/terms-and-conditions/${locale}`
  try {
    console.log('Fetching Terms and conditions')
    const response = await axios.get(termsUrl)
    termsAndConditions = response.data
  } catch (error) {
    console.error(`Request failed: ${termsUrl}`)
  }

  // About
  let about = []
  const aboutUrl = `${cms_url}mobile/about/${locale}`
  try {
    console.log('Fetching About')
    const response = await axios.get(aboutUrl)
    about = response.data
  } catch (error) {
    console.error(`Request failed: ${aboutUrl}`)
  }

  // About Banner
  // let aboutBanner = []
  // const aboutBannerUrl = `${cms_url}mobile/about-banner/${locale}`
  // try {
  //   console.log('Fetching About Banner')
  //   const response = await axios.get(aboutBannerUrl)
  //   aboutBanner = response.data
  // } catch (error) {
  //   console.error(`Request failed: ${aboutBannerUrl}`)
  // }

  // Help center
  let helpCenterResponse = []
  const helpUrl = `${cms_url}mobile/help-center/${locale}`
  try {
    console.log('Fetching Help center')
    const response = await axios.get(helpUrl)
    helpCenterResponse = response.data
  } catch (error) {
    console.error(`Request failed: ${helpUrl}`)
  }

  // Help center attributes
  let helpCenterAttributesResponse = []
  const helpAttributeUrl = `${cms_url}mobile/help-center-attribute/${locale}`
  try {
    console.log('Fetching Help center attributes')
    const response = await axios.get(helpAttributeUrl)
    helpCenterAttributesResponse = response.data
  } catch (error) {
    console.error(`Request failed: ${helpAttributeUrl}`)
  }

  // Quiz
  let quizzesResponse = []
  const quizUrl = `${cms_url}mobile/quizzes/${locale}`
  try {
    console.log('Fetching Quiz')
    const response = await axios.get(quizUrl)
    quizzesResponse = response.data
  } catch (error) {
    console.error(`Request failed: ${quizUrl}`)
  }

  // Did you know
  let didYouKnowsResponse = []
  const didYouKnowsUrl = `${cms_url}mobile/didyouknows/${locale}`
  try {
    console.log('Fetching Did you know')
    const response = await axios.get(didYouKnowsUrl)
    didYouKnowsResponse = response.data
  } catch (error) {
    console.error(`Request failed: ${didYouKnowsUrl}`)
  }

  // Avatar messages
  let avatarMessagesResponse = []
  const avatarUrl = `${cms_url}mobile/avatar-messages/${locale}`
  try {
    console.log('Fetching Avatar messages')
    const response = await axios.get(avatarUrl)
    avatarMessagesResponse = response.data
  } catch (error) {
    console.error(`Request failed: ${avatarUrl}`)
  }

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

  const outputFilepath = `./app/src/resources/translations/content/${locale}.ts`

  const outputString = `
import { StaticContent } from '../../../core/types'

export const ${locale}: StaticContent = ${JSON.stringify(result)}`

  fs.writeFileSync(outputFilepath, outputString)

  console.log(`\nFile created: ${outputFilepath}`)
}

getContent()
