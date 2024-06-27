import axios, { AxiosResponse } from "axios";
import * as types from "../core/api/types";
import {
  API_BASE_CMS_URL,
  API_BASE_URL,
  PREDICTION_ENDPOINT,
} from "../config/env";
// import * as config from "../config";

export const httpClient = createHttpClient(API_BASE_URL, API_BASE_CMS_URL, {
  predictionEndpoint: PREDICTION_ENDPOINT,
});

export function createHttpClient(
  endpoint: string,
  cmsEndpoint: string,
  {
    predictionEndpoint,
  }: {
    predictionEndpoint: string;
  }
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
        }
      );
      return response.data;
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
        }
      );
      return response.data;
    },
    // TODO:
    // eslint-disable-next-line
    resetPassword: async ({ name, secretAnswer, password }: any) => {
      // TODO:
      // eslint-disable-next-line
      const response: AxiosResponse<{}> = await axios.post(
        `${endpoint}/account/reset-password`,
        {
          name,
          secretAnswer,
          password,
        }
      );

      return response.data;
    },
    // TODO:
    // eslint-disable-next-line
    deleteUser: async ({ appToken }: any) => {
      await axios.post(`${endpoint}/account/delete`, null, {
        headers: { Authorization: `Bearer ${appToken}` },
      });
    },
    // TODO:
    // eslint-disable-next-line
    deleteUserFromPassword: async ({ name, password }: any) => {
      await axios.post(`${endpoint}/account/delete-from-password`, {
        name,
        password,
      });
    },
    getUserInfo: async (userName: string) => {
      const response: AxiosResponse<types.UserInfoResponse> = await axios.get(
        `${endpoint}/account/info/${encodeURIComponent(userName)}`
      );

      return response.data;
    },
    getPermanentAlert: async (
      versionName: string,
      locale: string,
      user: string
    ) => {
      const response: AxiosResponse<types.PermanentAlertResponse> =
        await axios.get(
          `${cmsEndpoint}/mobile/permanent-notification/${versionName}&${locale}&${user}`
        );
      return response.data;
    },
    // TODO:
    // eslint-disable-next-line
    replaceStore: async ({ storeVersion, appState, appToken }: any) => {
      const response: AxiosResponse<types.ReplaceStoreResponse> =
        await axios.post(
          `${endpoint}/account/replace-store`,
          {
            storeVersion,
            appState: JSON.stringify(appState),
          },
          {
            headers: { Authorization: `Bearer ${appToken}` },
          }
        );
      return response.data;
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
        }
      );

      return response.data;
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
        }
      );

      return response.data;
    },
    // TODO:
    // eslint-disable-next-line
    fetchSurveys: async ({ locale, userID }: any) => {
      const response: AxiosResponse<types.SurveysResponse> = await axios.get(
        `${cmsEndpoint}/mobile/new-surveys/${locale}?user_id=${userID.id}`
      );
      return response.data;
    },
    // @ts-expect-error TODO:
    fetchSingleNotification: async ({ locale }) => {
      const response: AxiosResponse<types.EncyclopediaResponse> =
        await axios.get(`${cmsEndpoint}/mobile/notification/${locale}`);
      return response.data;
    },
    // TODO:
    // eslint-disable-next-line
    appendEvents: async ({ events, appToken }: any) => {
      await axios.post(
        `${endpoint}/analytics/append-events`,
        { events },
        {
          headers: appToken ? { Authorization: `Bearer ${appToken}` } : {},
        }
      );
    },
    // @ts-expect-error TODO:
    sendContactUsForm: async (payload) => {
      const response: AxiosResponse<types.EncyclopediaResponse> =
        await axios.post(`${cmsEndpoint}/mobile/suggestions`, payload);
      return response.data;
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
            "content-type": "application/json",
          },
        }
      );
      return response.data;
    },
    // @ts-expect-error TODO:
    fetchContent: async ({ locale, timestamp = 0 }) => {
      const response: AxiosResponse<types.ContentResponse> = await axios.get(
        `${cmsEndpoint}/mobile/content/${locale}?timestamp=${timestamp}`
      );
      return response.data;
    },
  };
}
