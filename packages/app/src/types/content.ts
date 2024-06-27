export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  subCategory: string;
  isAgeRestricted: boolean;
  ageRestrictionLevel: number;
  contentFilter: number;
  voiceOverKey?: string;
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

export interface Surveys {
  date_created: string;
  id: string;
  isAgeRestricted: false;
  is_multiple: true;
  lang: string;
  live: true;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string;
  question: string;
  questions: ContentItem[];
}

interface SurveyContentItem {
  date_created: string;
  id: string;
  isAgeRestricted: false;
  is_multiple: true;
  lang: string;
  live: true;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string;
  question: string;
  questions: SurveyQuestionContentItem[];
  inProgress: boolean;
  currentQuestionIndex: number;
  answeredQuestion: AnsweredSurveyQuestionContentItem[];
}
interface SurveyQuestionContentItem {
  id: string;
  is_multiple: boolean;
  next_question: ContentItem;
  options: ContentItem[];
  question: string;
  response: string;
  sort_number: string;
  surveyId: string;
  answeredQuestion: AnsweredSurveyQuestionContentItem;
}

interface AnsweredSurveyQuestionContentItem {
  questionId: string;
  question: string;
  answerID: string;
  answer: string;
  response: string;
  isMultiple: boolean;
}
export interface AllSurveys extends Array<SurveyContentItem> {}
export interface CompletedSurveys extends Array<CompletedSurveyItem> {}
interface CompletedSurveyItem {
  id: string;
}

export interface HelpCenterItem {
  id: number;
  title: string;
  caption: string;
  contactOne: string;
  contactTwo?: string;
  address: string;
  website: string;
  lang: string;
  isAvailableNationwide?: boolean;
  primaryAttributeId?: string | number;
  otherAttributes?: string;
  isActive?: boolean;
  city?: string;
  province?: {
    name: string;
    code: string;
  };
  sotringKey?: number;
  attributeName?: string;
}
export interface HelpCenters extends Array<HelpCenterItem> {}

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
  surveys: Surveys;
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
