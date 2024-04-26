import fs from 'fs'
import { appTranslations } from './packages/core/src/modules/translations/app'
import { logger } from './logger'

// Keys that were present in previous versions but have since been removed
const legacyAppKeys = [
  'oky',
  'header',
  'hi',
  'email',
  'request_sent',
  'undo',
  'quiz_question',
  'birth_year_info_heading',
  'not_correct',
  'passcode_description',
  'password_info_label',
  'splash_text',
  'hills',
  'mosaic',
  'village',
  'desert',
  'lang_select',
  'penal_code_text1',
  'penal_code_heading',
  'boys',
  'care',
  'family',
  'feelings',
  'growing',
  'health',
  'life',
  'periods',
  'start_new',
  'no_day',
  'notification_1_title',
  'notification_1_body',
  'notification_2_title',
  'notification_2_body',
  'notification_3_title',
  'notification_3_body',
  'notification_4_title',
  'notification_4_body',
  'notification_5_title',
  'notification_5_body',
  'notification_6_title',
  'notification_6_body',
  'ari',
  'nur',
  'julia',
  'pihu',
  'shiko',
  'kuku',
  'selected_avatar',
  'selected_theme',
  'choose_language',
  'en',
  'fr',
  'id',
  'mn',
  'pt',
  'ru',
  'location_subtitle',
  'password_request_info',
  'period_day',
  'new_cycle',
  'start_early_button',
  'too_close_next',
  'journey_heading',
  'journey_content',
  'safe_word',
  'chat',
  'contact name',
  'description',
  'contact_name_1',
  'contact_address_1',
  'contact_phone_number_1',
  'contact_website_1',
  'contact_name_2',
  'contact_address_2',
  'contact_phone_number_2',
  'contact_website_2',
  'contact_name_3',
  'contact_address_3',
  'contact_phone_number_3',
  'contact_website_3',
  'survey_option_unit_day',
  'survey_option_unit_days',
  'survey_option_unit_week',
  'survey_option_unit_weeks',
  'contact_details',
  'are_you_on_period',
  'thanks_for_response',
  'name_error_heading',
  'name_error_content',
  'password_confirm_error_heading',
  'password_confirm_error_content',
  'login_name_error_heading',
  'login_name_error_content',
  'login_password_error_heading',
  'login_password_error_content',
  'internet_error',
  'login_failed',
  'penal_code_warning',
  'penal_code_restriction',
  'could_not_edit',
  'could_not_change_password',
  'daily_survey_content',
  'daily_notes_content',
  'prediction_change',
  'period_start_cloud',
]

const locales = Object.keys(appTranslations)

locales.forEach((locale) => {
  const translations = appTranslations[locale]

  const output = Object.entries(translations).reduce((acc, [key, value]) => {
    if (legacyAppKeys.includes(key)) {
      return acc
    }

    return {
      ...acc,
      [key]: value,
    }
  }, {})

  const outputFilepath = `./packages/core/src/modules/translations/app/${locale}.ts`

  const outputString = `
  import { AppTranslations } from '../../../types'

  export const ${locale}: AppTranslations = ${JSON.stringify(output)}`

  fs.writeFileSync(outputFilepath, outputString)
})

logger('=========================')
logger('Removed legacy keys')
logger('=========================')
