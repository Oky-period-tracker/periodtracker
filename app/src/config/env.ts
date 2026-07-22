// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck TODO:
export const ENV = process.env.EXPO_PUBLIC_ENV || 'production'

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'
export const API_BASE_CMS_URL = process.env.EXPO_PUBLIC_API_BASE_CMS_URL || 'http://localhost:5000'
export const PREDICTION_ENDPOINT = process.env.EXPO_PUBLIC_PREDICTION_ENDPOINT || ''
// Which prediction engine the app talks to. The repo is open source, so a
// self-hoster may still be running the legacy ("v1") engine. Defaults to 'v1'
// for backwards compatibility; set to 'v2' to use the new Bayesian engine.
// v1 and v2 use different request/response formats (see HttpClient.getPeriodCycles).
export const PREDICTION_ENGINE_VERSION =
  process.env.EXPO_PUBLIC_PREDICTION_ENGINE_VERSION === 'v2' ? 'v2' : 'v1'
export const WEBSITE_URL = process.env.EXPO_PUBLIC_WEBSITE_URL || ''

// Development purposes only
export const FAST_SIGN_UP = !!process.env.EXPO_PUBLIC_FAST_SIGN_UP

export const AUDIO_BASE_URL = process.env.EXPO_PUBLIC_AUDIO_BASE_URL

// Optional features
export const USE_AVATAR_CUSTOMIZATION = process.env.EXPO_PUBLIC_USE_AVATAR_CUSTOMIZATION === 'true'
