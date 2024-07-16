export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  subCategory: string;
  categoryId: string;
  subCategoryId: string;
  live?: boolean;
}

export interface Articles {
  byId: {
    [id: string]: Article;
  };
  allIds: string[];
}

export interface VideoData {
  id: string;
  title: string;
  youtubeId?: string; // Part of the youtube url after v=
  assetName?: string; // Key for video in the assets.ts file
  live?: boolean;
}

export interface Videos {
  byId: {
    [id: string]: VideoData;
  };
  allIds: string[];
}

interface AvatarMessageItem {
  id: string;
  content: string;
  live?: boolean;
}
export interface AvatarMessages extends Array<AvatarMessageItem> {}

export interface Categories {
  byId: {
    [id: string]: {
      id: string;
      name: string;
      tags: {
        primary: {
          name: string;
          emoji: string;
        };
        secondary?: {
          name: string;
          emoji: string;
        };
      };
      videos?: string[];
      subCategories: string[];
    };
  };
  allIds: string[];
}

export interface SubCategories {
  byId: {
    [id: string]: {
      id: string;
      name: string;
      articles: string[];
    };
  };
  allIds: string[];
}

export interface DidYouKnows {
  byId: {
    [id: string]: {
      id: string;
      isAgeRestricted: boolean;
      title: string;
      content: string;
      live?: boolean;
    };
  };
  allIds: string[];
}

export interface Quiz {
  id: string;
  isAgeRestricted: boolean;
  topic?: string;
  question: string;
  answers: Array<{
    text: string;
    emoji: string;
    isCorrect: boolean;
  }>;
  response: {
    correct: string;
    in_correct: string;
  };
  live?: boolean;
}

export interface Quizzes {
  byId: {
    [id: string]: Quiz;
  };
  allIds: string[];
}

export type Survey = {
  id: string;
  questions: SurveyQuestion[];
  isAgeRestricted: boolean;
  date_created: string;
  lang: string;
  live: true;
  //
  is_multiple?: boolean; // @deprecated
  option1?: string; // @deprecated
  option2?: string; // @deprecated
  option3?: string; // @deprecated
  option4?: string; // @deprecated
  option5?: string; // @deprecated
  question?: string; // @deprecated
  response?: string; // @deprecated
};

export type SurveyAnswerOption = { [key: string]: string };

export type SurveyOptions = [
  SurveyAnswerOption?,
  SurveyAnswerOption?,
  SurveyAnswerOption?,
  SurveyAnswerOption?,
  SurveyAnswerOption?
];

export interface SurveyQuestion {
  id: string;
  question: string;
  options: SurveyOptions;
  next_question: {
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    option5: string;
  };
  is_multiple: boolean;
  //
  sort_number: string;
  surveyId: string;
  response: string;
}

export interface SurveyQuestionAnswer {
  questionId: string;
  question: string;
  answerID: string;
  answer: string;
  // TODO: Below is redundant?
  response: string;
  isMultiple: boolean;
}

export interface AllSurveys extends Array<Survey> {}
export interface CompletedSurveys extends Array<CompletedSurveyItem> {}
interface CompletedSurveyItem {
  id: string;
}

export interface HelpCenter {
  id: number;
  title: string;
  caption: string;
  contactOne: string;
  contactTwo?: string;
  address: string;
  websites: string; // comma separated strings
  lang: string;
  //
  primaryAttributeId: number | null;
  otherAttributes: string | null; // comma separated ids
  //
  regionId: string;
  subRegionId: string;
  isAvailableEverywhere: boolean;
  //
  isActive: boolean;
  sortingKey: number;
}

export interface HelpCenters extends Array<HelpCenter> {}

interface ContentItem {
  type: "HEADING" | "CONTENT";
  content: string;
}

export interface PrivacyPolicy extends Array<ContentItem> {}
export interface TermsAndConditions extends Array<ContentItem> {}
export interface About extends Array<ContentItem> {}

export enum HelpCenterUI {
  HC = "help-centers",
  SAVED_HC = "saved-help-centers",
}

export interface Locations {
  name: string;
  region: string;
  places: Places[];
}

export interface Places {
  name: string;
}

export interface StaticContent {
  locale: string;
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
  allSurveys: AllSurveys;
  completedSurveys: CompletedSurveys;
  videos?: Videos;
}
