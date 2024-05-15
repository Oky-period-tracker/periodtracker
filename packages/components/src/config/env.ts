import env from 'react-native-config'

export const API_BASE_URL = env.API_BASE_URL || 'http://localhost:3000'
export const API_BASE_CMS_URL = env.API_BASE_CMS_URL || 'http://localhost:5000'
export const PREDICTION_ENDPOINT = env.PREDICTION_ENDPOINT
export const WEBSITE_URL = env.WEBSITE_URL

export const HAPTIC_AND_SOUND_ENABLED = env.HAPTIC_AND_SOUND_ENABLED || false

export const STORAGE_BASE_URL = env.STORAGE_BASE_URL || ''

// Sign up & edit profile
export const ASK_COUNTRY = env.ASK_COUNTRY ?? true
export const ASK_CITY = env.ASK_CITY || false

// Development purposes only
export const FAST_SIGN_UP = false
