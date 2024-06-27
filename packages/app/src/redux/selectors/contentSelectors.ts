import { ReduxState } from "../store";
import _ from "lodash";

const s = (state: ReduxState) => state.content;

export const allArticlesSelector = (state: ReduxState) =>
  s(state).articles.allIds.map((id) => s(state).articles.byId[id]);

export const allVideosSelector = (state: ReduxState) => {
  if (!s(state)?.videos?.allIds || !s(state)?.videos?.byId) return [];
  // @ts-expect-error TODO:
  return s(state).videos.allIds.map((id) => s(state).videos.byId[id]);
};

// @ts-expect-error TODO:
export const articleByIDSelector = (state: ReduxState, id) =>
  s(state).articles.byId[id];
// @ts-expect-error TODO:
export const videoByIDSelector = (state: ReduxState, id) =>
  s(state)?.videos?.byId[id];

export const articlesObjectByIDSelector = (state: ReduxState) =>
  s(state).articles.byId;

// TODO:
// eslint-disable-next-line
export const allHelpCentersForCurrentLocale: any = (state: ReduxState) =>
  s(state).helpCenters.filter((item) => item.lang === state.app.locale);

export const allCategoriesSelector = (state: ReduxState) =>
  s(state).categories.allIds.map((id) => s(state).categories.byId[id]);

export const allCategoryEmojis = (state: ReduxState) => {
  const categories = allCategoriesSelector(state);

  return categories.map((item) => {
    return { tag: item.tags.primary.name, emoji: item.tags.primary.emoji };
  });
};

export const allSubCategoriesSelector = (state: ReduxState) =>
  s(state).subCategories.allIds.map((id) => s(state).subCategories.byId[id]);

export const allSubCategoriesObjectSelector = (state: ReduxState) =>
  s(state).subCategories.byId;

// @ts-expect-error TODO:
export const categoryByIDSelector = (state: ReduxState, id) =>
  s(state).categories.byId[id];

// @ts-expect-error TODO:
export const subCategoryByIDSelector = (state: ReduxState, id) =>
  s(state).subCategories.byId[id];

export const allAvatarText = (state: ReduxState) => s(state).avatarMessages;

export const privacyContent = (state: ReduxState) => s(state).privacyPolicy;

export const termsAndConditionsContent = (state: ReduxState) =>
  s(state).termsAndConditions;

export const aboutContent = (state: ReduxState) => s(state).about;

export const allSurveys = (state: ReduxState) => s(state).allSurveys;

export const completedSurveys = (state: ReduxState) =>
  s(state).completedSurveys;

export const aboutBanner = (state: ReduxState) => s(state).aboutBanner;

export const allQuizzesSelectors = (state: ReduxState) => {
  // TODO: FIXME
  const isUserYoungerThan15 = true;
  // moment()
  //   .utc()
  //   .diff(state.auth.user.dateOfBirth) < 15
  const tempArr = [];
  const filteredArray = s(state).quizzes.allIds.reduce((acc, id) => {
    if (
      (!s(state).quizzes.byId[id]?.isAgeRestricted && isUserYoungerThan15) ||
      !isUserYoungerThan15
    ) {
      tempArr.push(s(state).quizzes.byId[id]);
    }
    if (
      (!s(state).quizzes.byId[id].isAgeRestricted && isUserYoungerThan15) ||
      !isUserYoungerThan15
    ) {
      // @ts-expect-error TODO:
      acc.push(s(state).quizzes.byId[id]);
    }
    return acc;
  }, []);

  // In the extreme event of all content being age restricted return the first quiz/ did you know instead of crashing the app

  if (_.isEmpty(filteredArray)) {
    return [s(state).quizzes.byId[s(state).quizzes.allIds[0]]];
  }

  return filteredArray;
};

export const allDidYouKnowsSelectors = (state: ReduxState) => {
  // TODO_ALEX: FIXME
  const isUserYoungerThan15 = true;
  // moment()
  //   .utc()
  //   .diff(state.auth.user.dateOfBirth) < 15
  const filteredArray = s(state).didYouKnows.allIds.reduce((acc, id) => {
    if (
      (!s(state).didYouKnows.byId[id]?.isAgeRestricted &&
        isUserYoungerThan15) ||
      !isUserYoungerThan15
    ) {
      // @ts-expect-error TODO:
      acc.push(s(state).didYouKnows.byId[id]);
    }
    return acc;
  }, []);

  // In the extreme event of all content being age restricted return the first quiz/ did you know instead of crashing the app
  if (_.isEmpty(filteredArray)) {
    return [s(state).didYouKnows.byId[s(state).didYouKnows.allIds[0]]];
  }

  return filteredArray;
};
