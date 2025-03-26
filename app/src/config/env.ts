// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck TODO:
export const ENV = process.env.EXPO_PUBLIC_ENV || 'production'

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'
export const API_BASE_CMS_URL = process.env.EXPO_PUBLIC_API_BASE_CMS_URL || 'http://localhost:5000'
export const PREDICTION_ENDPOINT = process.env.EXPO_PUBLIC_PREDICTION_ENDPOINT || ''
export const WEBSITE_URL = process.env.EXPO_PUBLIC_WEBSITE_URL || ''

// Development purposes only
export const FAST_SIGN_UP = !!process.env.EXPO_PUBLIC_FAST_SIGN_UP

export const AUDIO_BASE_URL = process.env.EXPO_PUBLIC_AUDIO_BASE_URL
