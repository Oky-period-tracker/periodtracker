import env from 'react-native-config'

export const API_BASE_URL = env.API_BASE_URL || 'http://localhost:3000'
export const API_BASE_CMS_URL = env.API_BASE_CMS_URL || 'http://localhost:5000'
export const PREDICTION_ENDPOINT = env.PREDICTION_ENDPOINT
export const WEBSITE_URL = env.WEBSITE_URL

// Development purposes only
export const FAST_SIGN_UP = true
