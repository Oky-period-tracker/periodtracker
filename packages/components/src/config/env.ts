import env from 'react-native-config'

export const API_BASE_URL = env.API_BASE_URL || 'http://localhost:3000'
export const API_BASE_CMS_URL = env.API_BASE_CMS_URL || 'http://localhost:5000'
export const PREDICTION_ENDPOINT = env.PREDICTION_ENDPOINT
export const WEBSITE_URL = env.WEBSITE_URL

// Optional features
export const HAPTIC_AND_SOUND_ENABLED =
  env.HAPTIC_AND_SOUND_ENABLED !== undefined ? env.HAPTIC_AND_SOUND_ENABLED === 'true' : false

export const STORAGE_BASE_URL = env.STORAGE_BASE_URL || ''

export const ASK_COUNTRY = env.ASK_COUNTRY !== undefined ? env.ASK_COUNTRY === 'true' : true

export const ASK_CITY = env.ASK_CITY !== undefined ? env.ASK_CITY === 'true' : false

export const SHOW_ENCYCLOPEDIA_LOGGED_OUT =
  env.SHOW_ENCYCLOPEDIA_LOGGED_OUT !== undefined
    ? env.SHOW_ENCYCLOPEDIA_LOGGED_OUT === 'true'
    : true

// Development purposes only
export const FAST_SIGN_UP = false
