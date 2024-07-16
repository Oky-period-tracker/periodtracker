import {
  Articles,
  Categories,
  SubCategories,
  Quizzes,
  DidYouKnows,
  HelpCenters,
  AvatarMessages,
  PrivacyPolicy,
  TermsAndConditions,
  About,
  AllSurveys,
  CompletedSurveys,
  Videos,
} from "../../types";
import { Actions } from "../types/index";

export interface ContentState {
  timeFetched?: number;
  aboutBannerTimestamp?: number;
  articles: Articles;
  categories: Categories;
  subCategories: SubCategories;
  quizzes: Quizzes;
  didYouKnows: DidYouKnows;
  helpCenters: HelpCenters;
  avatarMessages: AvatarMessages;
  privacyPolicy: PrivacyPolicy;
  termsAndConditions: TermsAndConditions;
  about: About;
  aboutBanner: string;
  allSurveys: AllSurveys;
  completedSurveys: CompletedSurveys;
  videos?: Videos;
  surveys?: never; // @deprecated
}

const initialState: ContentState = {
  timeFetched: undefined,
  aboutBannerTimestamp: undefined,
  articles: {
    byId: {},
    allIds: [],
  },
  categories: {
    byId: {},
    allIds: [],
  },
  subCategories: {
    byId: {},
    allIds: [],
  },
  allSurveys: [],
  completedSurveys: [],
  quizzes: {
    byId: {},
    allIds: [],
  },
  didYouKnows: {
    byId: {},
    allIds: [],
  },
  helpCenters: [],
  avatarMessages: [],
  privacyPolicy: [],
  termsAndConditions: [],
  about: [],
  aboutBanner: "",
  videos: {
    byId: {},
    allIds: [],
  },
};

export function contentReducer(
  state = initialState,
  action: Actions
): ContentState {
  switch (action.type) {
    case "INIT_STALE_CONTENT":
      return {
        ...state,
        ...action.payload,
      };

    case "FETCH_CONTENT_SUCCESS": {
      const shouldUpdateBanner = action.payload.aboutBanner !== undefined;

      return {
        ...state,
        timeFetched: action.payload.timeFetched,
        articles: action.payload.articles,
        videos: action.payload.videos,
        categories: action.payload.categories,
        subCategories: action.payload.subCategories,
        quizzes: action.payload.quizzes,
        didYouKnows: action.payload.didYouKnows,
        helpCenters: action.payload.helpCenters,
        avatarMessages: action.payload.avatarMessages,
        privacyPolicy: action.payload.privacyPolicy,
        termsAndConditions: action.payload.termsAndConditions,
        about: action.payload.about,
        // @ts-expect-error TODO:
        aboutBanner: shouldUpdateBanner
          ? action.payload.aboutBanner
          : state.aboutBanner,
        aboutBannerTimestamp: shouldUpdateBanner
          ? action.payload.aboutBannerTimestamp
          : state.aboutBannerTimestamp,
      };
    }

    case "UPDATE_ALL_SURVEYS_CONTENT":
      return {
        ...state,
        allSurveys: action.payload.allSurveys,
      };

    case "UPDATE_COMPLETED_SURVEYS":
      return {
        ...state,
        completedSurveys: action.payload.completedSurveys,
      };

    case "ANSWER_SURVEY": {
      const allSurveys = state.allSurveys.filter(
        (item) => item.id !== action.payload.id
      );

      const completedSurveys = [
        ...state.completedSurveys,
        { id: action.payload.id },
      ];

      return {
        ...state,
        allSurveys,
        completedSurveys,
      };
    }

    default:
      return state;
  }
}
