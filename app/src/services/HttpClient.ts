import axios, { AxiosResponse } from 'axios'
import * as types from '../core/api/types'
import { API_BASE_CMS_URL, API_BASE_URL, PREDICTION_ENDPOINT } from '../config/env'
import { Locale } from '../resources/translations'
import { User } from '../types'
// import * as config from "../config";

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
    // TODO:
    // eslint-disable-next-line
    getPeriodCycles: async ({ cycle_lengths, period_lengths, age }: any) => {
      // TODO:
      // eslint-disable-next-line
      const response: AxiosResponse<{}> = await axios.post(
        predictionEndpoint,
        {
          cycle_lengths,
          period_lengths,
          age,
        },
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      )

      return response.data
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
    // TODO:
    // fetchContent: async ({ locale, timestamp = 0 }) => {
    //   const response: AxiosResponse<types.ContentResponse> = await axios.get(
    //     `${cmsEndpoint}/mobile/content/${locale}?timestamp=${timestamp}`
    //   );
    //   return response.data;
    // },
  }
}
