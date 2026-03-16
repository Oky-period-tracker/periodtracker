import * as types from '../core/api/types'
import { API_BASE_CMS_URL, API_BASE_URL, PREDICTION_ENDPOINT } from '../config/env'
import { Locale } from '../resources/translations'
import { User } from '../types'
// import * as config from "../config";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...((options?.headers as Record<string, string>) || {}),
    },
    ...options,
  })
  if (!response.ok) {
    const error = new Error(`HTTP Error: ${response.status}`)
    throw error
  }
  return response.json() as Promise<T>
}

export const httpClient = createHttpClient(API_BASE_URL, API_BASE_CMS_URL, {
  predictionEndpoint: PREDICTION_ENDPOINT,
})

export function createHttpClient(
  endpoint: string,
  cmsEndpoint: string,
  {
    predictionEndpoint,
  }: {
    predictionEndpoint: string
  },
) {
  return {
    // TODO:
    // eslint-disable-next-line
    login: async ({ name, password }: any) => {
      return fetchJson<types.LoginResponse>(`${endpoint}/account/login`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          password,
        }),
      })
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
      deviceId = null,
    }: // TODO:
    // eslint-disable-next-line
    any) => {
      return fetchJson<types.SignupResponse>(`${endpoint}/account/signup`, {
        method: 'POST',
        body: JSON.stringify({
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
          deviceId,
        }),
      })
    },
    // TODO:
    // eslint-disable-next-line
    resetPassword: async ({ name, secretAnswer, password }: any) => {
      // TODO:
      // eslint-disable-next-line
      return fetchJson<{}>(`${endpoint}/account/reset-password`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          secretAnswer,
          password,
        }),
      })
    },
    // TODO:
    // eslint-disable-next-line
    deleteUser: async ({ appToken }: any) => {
      await fetchJson<{}>(`${endpoint}/account/delete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${appToken}` },
      })
    },
    // TODO:
    // eslint-disable-next-line
    deleteUserFromPassword: async ({ name, password }: any) => {
      await fetchJson<{}>(`${endpoint}/account/delete-from-password`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          password,
        }),
      })
    },
    getUserInfo: async (userName: string) => {
      return fetchJson<types.UserInfoResponse>(
        `${endpoint}/account/info/${encodeURIComponent(userName)}`,
      )
    },
    getPermanentAlert: async (versionName: string, locale: string, user: string) => {
      return fetchJson<types.PermanentAlertResponse>(
        `${cmsEndpoint}/mobile/permanent-notification/${versionName}&${locale}&${user}`,
      )
    },
    // TODO:
    // eslint-disable-next-line
    replaceStore: async ({ storeVersion, appState, appToken }: any) => {
      return fetchJson<types.ReplaceStoreResponse>(`${endpoint}/account/replace-store`, {
        method: 'POST',
        body: JSON.stringify({
          storeVersion,
          appState: JSON.stringify(appState),
        }),
        headers: { Authorization: `Bearer ${appToken}` },
      })
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
      return fetchJson<{}>(`${endpoint}/account/edit-info`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          dateOfBirth,
          gender,
          location,
          secretQuestion,
          metadata,
        }),
        headers: { Authorization: `Bearer ${appToken}` },
      })
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
      return fetchJson<{}>(`${endpoint}/account/edit-secret-answer`, {
        method: 'POST',
        body: JSON.stringify({
          previousSecretAnswer,
          nextSecretAnswer,
        }),
        headers: { Authorization: `Bearer ${appToken}` },
      })
    },
    fetchAvatarMessages: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.AvatarMessagesResponse>(
        `${cmsEndpoint}/mobile/avatar-messages/${locale}`,
      )
    },
    fetchEncyclopedia: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.EncyclopediaResponse>(
        `${cmsEndpoint}/mobile/articles/${locale}`,
      )
    },
    fetchVideos: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.EncyclopediaResponse>(
        `${cmsEndpoint}/mobile/videos/${locale}`,
      )
    },
    fetchSurveys: async ({ locale, userID }: { locale: Locale; userID: User }) => {
      return fetchJson<types.SurveysResponse>(
        `${cmsEndpoint}/mobile/new-surveys/${locale}?user_id=${userID.id}`,
      )
    },
    fetchPrivacyPolicy: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.PrivacyResponse>(
        `${cmsEndpoint}/mobile/privacy-policy/${locale}`,
      )
    },
    fetchTermsAndConditions: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.TermsAndConditionsResponse>(
        `${cmsEndpoint}/mobile/terms-and-conditions/${locale}`,
      )
    },
    fetchAbout: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.AboutResponse>(
        `${cmsEndpoint}/mobile/about/${locale}`,
      )
    },
    fetchAboutBanner: async ({ locale }: { locale: Locale }) => {
      // @deprecated
      return fetchJson<types.AboutBannerResponse>(
        `${cmsEndpoint}/mobile/about-banner/${locale}`,
      )
    },
    fetchAboutBannerConditional: async ({
      locale,
      timestamp = 0,
    }: {
      locale: Locale
      timestamp: number
    }) => {
      return fetchJson<types.AboutBannerConditionalResponse>(
        `${cmsEndpoint}/mobile/about-banner-conditional/${locale}?timestamp=${timestamp}`,
      )
    },
    fetchQuizzes: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.QuizzesResponse>(
        `${cmsEndpoint}/mobile/quizzes/${locale}`,
      )
    },
    fetchDidYouKnows: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.DidYouKnowsResponse>(
        `${cmsEndpoint}/mobile/didyouknows/${locale}`,
      )
    },
    fetchHelpCenters: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.HelpCenterResponse>(
        `${cmsEndpoint}/mobile/help-center/${locale}`,
      )
    },
    fetchHelpCenterAttributes: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.HelpCenterResponse>(
        `${cmsEndpoint}/mobile/help-center-attribute/${locale}`,
      )
    },
    fetchSingleNotification: async ({ locale }: { locale: Locale }) => {
      return fetchJson<types.EncyclopediaResponse>(
        `${cmsEndpoint}/mobile/notification/${locale}`,
      )
    },
    // TODO:
    // eslint-disable-next-line
    appendEvents: async ({ events, appToken }: any) => {
      await fetchJson<{}>(`${endpoint}/analytics/append-events`, {
        method: 'POST',
        body: JSON.stringify({ events }),
        headers: appToken ? { Authorization: `Bearer ${appToken}` } : {},
      })
    },
    // @ts-expect-error TODO:
    sendContactUsForm: async (payload) => {
      return fetchJson<types.EncyclopediaResponse>(`${cmsEndpoint}/mobile/suggestions`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    },
    // TODO:
    // eslint-disable-next-line
    getPeriodCycles: async ({ cycle_lengths, period_lengths, age }: any) => {
      // TODO:
      // eslint-disable-next-line
      return fetchJson<{}>(
        predictionEndpoint,
        {
          method: 'POST',
          body: JSON.stringify({
            cycle_lengths,
            period_lengths,
            age,
          }),
        },
      )
    },
    updateUserVerifiedDays: async ({
      appToken,
      metadata,
    }: // TODO:
    // eslint-disable-next-line
    any) => {
      // TODO:
      // eslint-disable-next-line
      return fetchJson<{}>(`${endpoint}/account/update-verified-dates`, {
        method: 'POST',
        body: JSON.stringify({
          metadata,
        }),
        headers: { Authorization: `Bearer ${appToken}` },
      })
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
