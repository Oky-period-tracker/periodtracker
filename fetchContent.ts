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
import { Locale } from './app/src/resources/translations'
import { appTranslations } from './app/src/resources/translations/app'

// Use local CMS container by default, allow override via environment variable
const cms_url = process.env.CMS_URL || 'http://localhost:5000/'

// All supported locales
const locales: Locale[] = ['en', 'fr', 'ru', 'pt', 'es']

// List of all 116 translation keys that should be in the translations object
const translationKeys = [
  // Accessibility Labels (34 keys)
  'select_avatar_button',
  'select_theme_button',
  'select_color_button',
  'select_option_button',
  'select_category_button',
  'previous_page_button',
  'next_page_button',
  'arrow_button',
  'continue',
  'confirm',
  'close',
  'customizer_exit',
  'customizer_save_friend',
  'tutorial_button',
  'skip_tutorial_button',
  'close_tooltip_button',
  'customizer_tutorial_back',
  'customizer_tutorial_next',
  'customizer_tutorial_finish',
  'name_input',
  'skip_name_button',
  'save_and_continue_button',
  'friend_unlock_modal_title',
  'friend_unlock_modal_button',
  'friend_unlock_celebration_image',
  'name_info_label',
  'privacy_policy_link',
  't_and_c_link',
  'i_agree',
  'month_selector',
  'search_country',
  'clear_search',
  'info_button',
  'accessibility_prompt',
  // Tutorial Texts (11 keys)
  'customizer_tutorial_title',
  'customizer_tutorial_step1_title',
  'customizer_tutorial_step1_text',
  'customizer_tutorial_step2_title',
  'customizer_tutorial_step2_text',
  'customizer_tutorial_step3_title',
  'customizer_tutorial_step3_text',
  'customizer_tutorial_step4_title',
  'customizer_tutorial_step4_text',
  'customizer_tutorial_step5_title',
  'customizer_tutorial_step5_text',
  // Clothing Items (17 keys)
  'customizer_clothing_dress1',
  'customizer_clothing_dress2',
  'customizer_clothing_dress3',
  'customizer_clothing_longdressbelt',
  'customizer_clothing_shortandshirt1',
  'customizer_clothing_shortandshirt2',
  'customizer_clothing_shortandshirt3',
  'customizer_clothing_skirtandshirt',
  'customizer_clothing_shirtandpants',
  'customizer_clothing_blazer1',
  'customizer_clothing_blazer2',
  'customizer_clothing_jumper',
  'customizer_clothing_cape',
  'customizer_clothing_hijab',
  'customizer_clothing_longuniform',
  'customizer_clothing_traditional1',
  'customizer_clothing_traditional2',
  'customizer_clothing_traditional3',
  'customizer_clothing_traditional4',
  'customizer_clothing_traditional5',
  // Devices (25 keys)
  'customizer_device_glasses',
  'customizer_device_readingglasses2',
  'customizer_device_darkglasses',
  'customizer_device_sunglass1',
  'customizer_device_sunglass2',
  'customizer_device_crown',
  'customizer_device_hat',
  'customizer_device_beanie',
  'customizer_device_beanie2',
  'customizer_device_buckethat',
  'customizer_device_cap',
  'customizer_device_sunhat',
  'customizer_device_headband',
  'customizer_device_head',
  'customizer_device_flowers',
  'customizer_device_bandana',
  'customizer_device_headphones',
  'customizer_device_necklace1',
  'customizer_device_necklace2',
  'customizer_device_necklace3',
  'customizer_device_earings',
  'customizer_device_purse',
  'customizer_device_cane',
  'customizer_device_prostetic1',
  'customizer_device_prostetic2',
  // Skin Colors (12 keys)
  'customizer_skin_color_light_pink',
  'customizer_skin_color_peach',
  'customizer_skin_color_beige',
  'customizer_skin_color_tan',
  'customizer_skin_color_dark_brown',
  'customizer_skin_color_light_tan',
  'customizer_skin_color_medium_brown',
  'customizer_skin_color_cream',
  'customizer_skin_color_bronze',
  'customizer_skin_color_ivory',
  'customizer_skin_color_sand',
  'customizer_skin_color_caramel',
  'customizer_skin_color_unknown',
  // Hair Colors (11 keys)
  'customizer_hair_color_black',
  'customizer_hair_color_brown',
  'customizer_hair_color_red',
  'customizer_hair_color_blonde',
  'customizer_hair_color_green',
  'customizer_hair_color_pink',
  'customizer_hair_color_orange',
  'customizer_hair_color_purple',
  'customizer_hair_color_dark_brown',
  'customizer_hair_color_bright_orange',
  'customizer_hair_color_blue',
  'customizer_hair_color_unknown',
  // Eye Colors (6 keys)
  'customizer_eye_color_black',
  'customizer_eye_color_brown',
  'customizer_eye_color_hazel',
  'customizer_eye_color_green',
  'customizer_eye_color_blue',
  'customizer_eye_color_gray',
  'customizer_eye_color_unknown',
]

// Build translations object from app translation files
const buildTranslationsFromApp = (locale: Locale): Record<string, string> => {
  const translations: Record<string, string> = {}
  const appTranslation = appTranslations[locale]

  for (const key of translationKeys) {
    const value = (appTranslation as any)[key]
    if (value !== undefined) {
      translations[key] = value
    }
  }

  return translations
}

const getContent = async (locale: Locale) => {
  console.log(`\n${'='.repeat(50)}`)
  console.log(`Processing Locale: ${locale}`)
  console.log(`CMS: ${cms_url}`)
  console.log(`${'='.repeat(50)}\n`)

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

  // Translations (unified translations from CMS)
  let translationsResponse = []
  const translationsUrl = `${cms_url}mobile/translations/${locale}`
  try {
    console.log('Fetching Translations')
    const response = await axios.get(translationsUrl)
    translationsResponse = response.data
  } catch (error) {
    console.error(`Request failed: ${translationsUrl}`)
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
  
  // Build translations from app translation files (primary source)
  // This ensures all 116 translation keys are included
  const appTranslations = buildTranslationsFromApp(locale)
  
  // Convert CMS response array to object format: { key: label }
  // CMS translations will override app translations if they exist
  const cmsTranslations: Record<string, string> = {}
  if (Array.isArray(translationsResponse)) {
    translationsResponse.forEach((item: any) => {
      if (item.key && item.label && item.live !== false) {
        cmsTranslations[item.key] = item.label
      }
    })
  }
  
  // Merge: CMS translations override app translations
  const translations = { ...appTranslations, ...cmsTranslations }

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
    translations,
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

  console.log(`\n✓ File created: ${outputFilepath}`)
}

// Generate content files for all locales
const generateAllContent = async () => {
  console.log(`\n${'='.repeat(50)}`)
  console.log(`Generating content files for ${locales.length} locales`)
  console.log(`Locales: ${locales.join(', ')}`)
  console.log(`${'='.repeat(50)}`)

  for (const locale of locales) {
    try {
      await getContent(locale)
    } catch (error) {
      console.error(`\n✗ Error processing locale ${locale}:`, error)
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`✓ Completed generating content files for all locales`)
  console.log(`${'='.repeat(50)}\n`)
}

generateAllContent()
