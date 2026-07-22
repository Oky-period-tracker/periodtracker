import axios, { AxiosResponse } from 'axios'
import { Alert } from 'react-native'
import * as types from '../core/api/types'
import {
  API_BASE_CMS_URL,
  API_BASE_URL,
  PREDICTION_ENDPOINT,
  PREDICTION_ENGINE_VERSION,
} from '../config/env'
import { Locale } from '../resources/translations'
import { User } from '../types'
import { allTranslations, initialLocale } from '../hooks/useTranslate'
import { ReduxState } from '../redux/reducers'
import { savePendingSyncData } from './pendingSync'
import { reduxStoreVersion } from '../optional/reduxMigrations'

type StoreRef = {
  dispatch: (action: { type: string }) => void
  getState: () => ReduxState
}

let storeRef: StoreRef | null = null
let hasHandledTokenTooLarge = false

export function setHttpClientStore(store: StoreRef) {
  storeRef = store
}

/**
 * Force logout of user, and store data locally so on next login we can reupload it.
 * This workflow addresses a 431 error caused by backend token sizes exceeding limits due to excessive metadata.
 * @returns
 */
function handleTokenTooLarge() {
  if (hasHandledTokenTooLarge) return
  hasHandledTokenTooLarge = true

  if (storeRef) {
    const state = storeRef.getState()
    const user = state.auth?.user

    if (user?.id) {
      savePendingSyncData({
        userId: user.id,
        replaceStore: {
          storeVersion: reduxStoreVersion,
          appState: {
            app: state.app,
            prediction: state.prediction,
            verifiedDates: state.answer?.[user.id]?.verifiedDates,
            helpCenters: state.helpCenters,
          },
        },
        editInfo: {
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          location: user.location,
          secretQuestion: user.secretQuestion,
          metadata: user.metadata,
        },
      })
    }

    storeRef.dispatch({ type: 'LOGOUT' })
  }

  const locale = (storeRef?.getState()?.app?.locale || initialLocale) as Locale
  // @ts-expect-error TODO: allTranslations type
  const t = (key: string) => allTranslations?.[locale]?.[key] || key

  Alert.alert(t('error'), t('session_expired'), [
    {
      text: t('ok'),
      onPress: () => {
        hasHandledTokenTooLarge = false
      },
    },
  ])
}

// Add a global axios response interceptor to catch 431 (Request Header Fields Too Large)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 431) {
      handleTokenTooLarge()
    }
    return Promise.reject(error)
  },
)

export const httpClient = createHttpClient(API_BASE_URL, API_BASE_CMS_URL, {
  predictionEndpoint: PREDICTION_ENDPOINT,
  predictionEngineVersion: PREDICTION_ENGINE_VERSION,
})

// Common shape returned by getPeriodCycles regardless of engine version, so
// callers (sagas) never need to know which engine produced the numbers.
// predictedPeriodLength is undefined when the engine does not return one (v2),
// in which case the caller derives it itself (e.g. from cycle history).
export type PredictionResult = {
  predictedCycleLength: number | undefined
  predictedPeriodLength: number | undefined
}

export function createHttpClient(
  endpoint: string,
  cmsEndpoint: string,
  {
    predictionEndpoint,
    predictionEngineVersion = 'v1',
  }: {
    predictionEndpoint: string
    predictionEngineVersion?: 'v1' | 'v2'
  },
) {
  return {
    // TODO:
    // eslint-disable-next-line
    login: async ({ name, password }: any) => {
      const response: AxiosResponse<types.LoginResponse> = await axios.post(
        `${endpoint}/account/login`,
        {
          name,
          password,
        },
      )
      return response.data
    },
    signup: async ({
      name,
      dateOfBirth,
      gender,
      location,
      country,
      province,
      password,
      secretQuestion,
      secretAnswer,
      dateSignedUp,
      metadata,
      preferredId = null,
    }: // TODO:
    // eslint-disable-next-line
    any) => {
      const response: AxiosResponse<types.SignupResponse> = await axios.post(
        `${endpoint}/account/signup`,
        {
          name,
          dateOfBirth,
          gender,
          location,
          country,
          province,
          password,
          secretAnswer,
          secretQuestion,
          dateSignedUp,
          metadata,
          preferredId,
          dateAccountSaved: new Date().toISOString(),
        },
      )
      return response.data
    },
    // TODO:
    // eslint-disable-next-line
    resetPassword: async ({ name, secretAnswer, password }: any) => {
      // TODO:
      // eslint-disable-next-line
      const response: AxiosResponse<{}> = await axios.post(`${endpoint}/account/reset-password`, {
        name,
        secretAnswer,
        password,
      })

      return response.data
    },
    // TODO:
    // eslint-disable-next-line
    deleteUser: async ({ appToken }: any) => {
      await axios.post(`${endpoint}/account/delete`, null, {
        headers: { Authorization: `Bearer ${appToken}` },
      })
    },
    // TODO:
    // eslint-disable-next-line
    deleteUserFromPassword: async ({ name, password }: any) => {
      await axios.post(`${endpoint}/account/delete-from-password`, {
        name,
        password,
      })
    },
    getUserInfo: async (userName: string) => {
      const response: AxiosResponse<types.UserInfoResponse> = await axios.get(
        `${endpoint}/account/info/${encodeURIComponent(userName)}`,
      )

      return response.data
    },
    getPermanentAlert: async (versionName: string, locale: string, user: string) => {
      const response: AxiosResponse<types.PermanentAlertResponse> = await axios.get(
        `${cmsEndpoint}/mobile/permanent-notification/${versionName}&${locale}&${user}`,
      )
      return response.data
    },
    // TODO:
    // eslint-disable-next-line
    replaceStore: async ({ storeVersion, appState, appToken }: any) => {
      const response: AxiosResponse<types.ReplaceStoreResponse> = await axios.post(
        `${endpoint}/account/replace-store`,
        {
          storeVersion,
          appState: JSON.stringify(appState),
        },
        {
          headers: { Authorization: `Bearer ${appToken}` },
        },
      )
      return response.data
    },
    editUserInfo: async ({
      appToken,
      name,
      dateOfBirth,
      gender,
      location,
      secretQuestion,
      metadata,
    }: // TODO:
    // eslint-disable-next-line
    any) => {
      // TODO:
      // eslint-disable-next-line
      const response: AxiosResponse<{}> = await axios.post(
        `${endpoint}/account/edit-info`,
        {
          name,
          dateOfBirth,
          gender,
          location,
          secretQuestion,
          metadata,
        },
        {
          headers: { Authorization: `Bearer ${appToken}` },
        },
      )

      return response.data
    },
    editUserSecretAnswer: async ({
      appToken,
      previousSecretAnswer,
      nextSecretAnswer,
    }: // TODO:
    // eslint-disable-next-line
    any) => {
      // TODO:
      // eslint-disable-next-line
      const response: AxiosResponse<{}> = await axios.post(
        `${endpoint}/account/edit-secret-answer`,
        {
          previousSecretAnswer,
          nextSecretAnswer,
        },
        {
          headers: { Authorization: `Bearer ${appToken}` },
        },
      )

      return response.data
    },
    fetchAvatarMessages: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.AvatarMessagesResponse> = await axios.get(
        `${cmsEndpoint}/mobile/avatar-messages/${locale}`,
      )
      return response.data
    },
    fetchEncyclopedia: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.EncyclopediaResponse> = await axios.get(
        `${cmsEndpoint}/mobile/articles/${locale}`,
      )
      return response.data
    },
    fetchVideos: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.EncyclopediaResponse> = await axios.get(
        `${cmsEndpoint}/mobile/videos/${locale}`,
      )
      return response.data
    },
    fetchSurveys: async ({ locale, userID }: { locale: Locale; userID: User }) => {
      const response: AxiosResponse<types.SurveysResponse> = await axios.get(
        `${cmsEndpoint}/mobile/new-surveys/${locale}?user_id=${userID.id}`,
      )
      return response.data
    },
    fetchPrivacyPolicy: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.PrivacyResponse> = await axios.get(
        `${cmsEndpoint}/mobile/privacy-policy/${locale}`,
      )

      return response.data
    },
    fetchTermsAndConditions: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.TermsAndConditionsResponse> = await axios.get(
        `${cmsEndpoint}/mobile/terms-and-conditions/${locale}`,
      )

      return response.data
    },
    fetchAbout: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.AboutResponse> = await axios.get(
        `${cmsEndpoint}/mobile/about/${locale}`,
      )

      return response.data
    },
    fetchAboutBanner: async ({ locale }: { locale: Locale }) => {
      // @deprecated
      const response: AxiosResponse<types.AboutBannerResponse> = await axios.get(
        `${cmsEndpoint}/mobile/about-banner/${locale}`,
      )

      return response.data
    },
    fetchAboutBannerConditional: async ({
      locale,
      timestamp = 0,
    }: {
      locale: Locale
      timestamp: number
    }) => {
      const response: AxiosResponse<types.AboutBannerConditionalResponse> = await axios.get(
        `${cmsEndpoint}/mobile/about-banner-conditional/${locale}?timestamp=${timestamp}`,
      )

      return response.data
    },
    fetchQuizzes: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.QuizzesResponse> = await axios.get(
        `${cmsEndpoint}/mobile/quizzes/${locale}`,
      )
      return response.data
    },
    fetchDidYouKnows: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.DidYouKnowsResponse> = await axios.get(
        `${cmsEndpoint}/mobile/didyouknows/${locale}`,
      )
      return response.data
    },
    fetchHelpCenters: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.HelpCenterResponse> = await axios.get(
        `${cmsEndpoint}/mobile/help-center/${locale}`,
      )
      return response.data
    },
    fetchHelpCenterAttributes: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.HelpCenterResponse> = await axios.get(
        `${cmsEndpoint}/mobile/help-center-attribute/${locale}`,
      )
      return response.data
    },
    fetchSingleNotification: async ({ locale }: { locale: Locale }) => {
      const response: AxiosResponse<types.EncyclopediaResponse> = await axios.get(
        `${cmsEndpoint}/mobile/notification/${locale}`,
      )
      return response.data
    },
    // TODO:
    // eslint-disable-next-line
    appendEvents: async ({ events, appToken }: any) => {
      await axios.post(
        `${endpoint}/analytics/append-events`,
        { events },
        {
          headers: appToken ? { Authorization: `Bearer ${appToken}` } : {},
        },
      )
    },
    // @ts-expect-error TODO:
    sendContactUsForm: async (payload) => {
      const response: AxiosResponse<types.EncyclopediaResponse> = await axios.post(
        `${cmsEndpoint}/mobile/suggestions`,
        payload,
      )
      return response.data
    },
    getPeriodCycles: async ({
      user_id,
      cycle_lengths,
      period_lengths,
      age,
      new_observation,
    }: {
      user_id: string
      cycle_lengths: number[]
      period_lengths: number[]
      age: number
      new_observation?: { cycle_start_date: string; observed_cycle_length: number }
    }): Promise<PredictionResult> => {
      // v1 (legacy) and v2 (Bayesian) engines use different endpoints/architectures
      // and therefore different request bodies and response shapes. We branch here
      // and normalise both into a single PredictionResult so callers stay agnostic.
      if (predictionEngineVersion === 'v2') {
        const response = await axios.post(
          predictionEndpoint,
          {
            user_id,
            cycle_history: cycle_lengths,
            period_history: period_lengths,
            age,
            new_observation,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )

        // v2 responds with { prediction: { predicted_cycle_length } } and does
        // not return a period length.
        return {
          predictedCycleLength: response.data?.prediction?.predicted_cycle_length,
          predictedPeriodLength: undefined,
        }
      }

      // v1 responds with { predicted_cycles: number[], predicted_periods: number[] }.
      const response = await axios.post(
        predictionEndpoint,
        {
          cycle_lengths,
          period_lengths,
          age,
        },
        {
          headers: { 'content-type': 'application/json' },
        },
      )

      return {
        predictedCycleLength: response.data?.predicted_cycles?.[0],
        predictedPeriodLength: response.data?.predicted_periods?.[0],
      }
    },
    updateUserVerifiedDays: async ({
      appToken,
      metadata,
    }: // TODO:
    // eslint-disable-next-line
    any) => {
      // TODO:
      // eslint-disable-next-line
      const response: AxiosResponse<{}> = await axios.post(
        `${endpoint}/account/update-verified-dates`,
        {
          metadata,
        },
        {
          headers: { Authorization: `Bearer ${appToken}` },
        },
      )

      return response.data
    },
    answerSurvey: async ({ appToken, live, questions }: any) => {
      const response: AxiosResponse<any> = await axios.post(
        `${endpoint}/survey`,
        { live, questions },
        { headers: { Authorization: `Bearer ${appToken}` } },
      )
      return response.data
    },
    updateAvatar: async ({ appToken, avatar }: { appToken: string; avatar: any }) => {
      const response: AxiosResponse<{}> = await axios.post(
        `${endpoint}/account/update-avatar`,
        {
          avatar,
        },
        {
          headers: { Authorization: `Bearer ${appToken}` },
        },
      )

      return response.data
    },
    // TODO:
    // fetchContent: async ({ locale, timestamp = 0 }) => {
    //   const response: AxiosResponse<types.ContentResponse> = await axios.get(
    //     `${cmsEndpoint}/mobile/content/${locale}?timestamp=${timestamp}`
    //   );
    //   return response.data;
    // },
  }
}
