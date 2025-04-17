import axios, { AxiosResponse } from 'axios'
import qs from 'qs'
import * as types from './types'
export * from './types'

export function createHttpClient(endpoint: string, cmsEndpoint: string, { predictionEndpoint }) {
  return {
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
    }: any) => {
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
    resetPassword: async ({ name, secretAnswer, password }: any) => {
      const response: AxiosResponse<{}> = await axios.post(`${endpoint}/account/reset-password`, {
        name,
        secretAnswer,
        password,
      })

      return response.data
    },
    deleteUser: async ({ appToken }: any) => {
      await axios.post(`${endpoint}/account/delete`, null, {
        headers: { Authorization: `Bearer ${appToken}` },
      })
    },
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
    }: any) => {
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
    editUserSecretAnswer: async ({ appToken, previousSecretAnswer, nextSecretAnswer }: any) => {
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
    fetchAvatarMessages: async ({ locale }) => {
      const response: AxiosResponse<types.AvatarMessagesResponse> = await axios.get(
        `${cmsEndpoint}/mobile/avatar-messages/${locale}`,
      )
      return response.data
    },
    fetchEncyclopedia: async ({ locale }) => {
      const response: AxiosResponse<types.EncyclopediaResponse> = await axios.get(
        `${cmsEndpoint}/mobile/articles/${locale}`,
      )
      return response.data
    },
    fetchVideos: async ({ locale }) => {
      const response: AxiosResponse<types.EncyclopediaResponse> = await axios.get(
        `${cmsEndpoint}/mobile/videos/${locale}`,
      )
      return response.data
    },
    fetchSurveys: async ({ locale, userID }: any) => {
      const response: AxiosResponse<types.SurveysResponse> = await axios.get(
        `${cmsEndpoint}/mobile/new-surveys/${locale}?user_id=${userID.id}`,
      )
      return response.data
    },
    fetchPrivacyPolicy: async ({ locale }: any) => {
      const response: AxiosResponse<types.PrivacyResponse> = await axios.get(
        `${cmsEndpoint}/mobile/privacy-policy/${locale}`,
      )

      return response.data
    },
    fetchTermsAndConditions: async ({ locale }: any) => {
      const response: AxiosResponse<types.TermsAndConditionsResponse> = await axios.get(
        `${cmsEndpoint}/mobile/terms-and-conditions/${locale}`,
      )

      return response.data
    },
    fetchAbout: async ({ locale }: any) => {
      const response: AxiosResponse<types.AboutResponse> = await axios.get(
        `${cmsEndpoint}/mobile/about/${locale}`,
      )

      return response.data
    },
    fetchAboutBanner: async ({ locale }: any) => {
      // @deprecated
      const response: AxiosResponse<types.AboutBannerResponse> = await axios.get(
        `${cmsEndpoint}/mobile/about-banner/${locale}`,
      )

      return response.data
    },
    fetchAboutBannerConditional: async ({ locale, timestamp = 0 }: any) => {
      const response: AxiosResponse<types.AboutBannerConditionalResponse> = await axios.get(
        `${cmsEndpoint}/mobile/about-banner-conditional/${locale}?timestamp=${timestamp}`,
      )

      return response.data
    },
    fetchQuizzes: async ({ locale }: any) => {
      const response: AxiosResponse<types.QuizzesResponse> = await axios.get(
        `${cmsEndpoint}/mobile/quizzes/${locale}`,
      )
      return response.data
    },
    fetchDidYouKnows: async ({ locale }: any) => {
      const response: AxiosResponse<types.DidYouKnowsResponse> = await axios.get(
        `${cmsEndpoint}/mobile/didyouknows/${locale}`,
      )
      return response.data
    },
    fetchHelpCenters: async ({ locale }: any) => {
      const response: AxiosResponse<types.HelpCenterResponse> = await axios.get(
        `${cmsEndpoint}/mobile/help-center/${locale}`,
      )
      return response.data
    },
    fetchSingleNotification: async ({ locale }) => {
      const response: AxiosResponse<types.EncyclopediaResponse> = await axios.get(
        `${cmsEndpoint}/mobile/notification/${locale}`,
      )
      return response.data
    },
    appendEvents: async ({ events, appToken }: any) => {
      await axios.post(
        `${endpoint}/analytics/append-events`,
        { events },
        {
          headers: appToken ? { Authorization: `Bearer ${appToken}` } : {},
        },
      )
    },
    sendContactUsForm: async (payload) => {
      const response: AxiosResponse<types.EncyclopediaResponse> = await axios.post(
        `${cmsEndpoint}/mobile/suggestions`,
        payload,
      )
      return response.data
    },
    getPeriodCycles: async ({ cycle_lengths, period_lengths, age }: any) => {
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
  }
}
