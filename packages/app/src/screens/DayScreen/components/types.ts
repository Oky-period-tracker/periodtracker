export type QuizStep =
  | "question "
  | "mood"
  | "body"
  | "activity"
  | "flow"
  | "notes";

type MoodOptions =
  | "happy"
  | "blah"
  | "sad"
  | "stressed"
  | "worried"
  | "fabulous";

type BodyOptions =
  | "tired"
  | "cramps"
  | "bloating"
  | "spots"
  | "headache"
  | "sore_breasts";

type ActivityOptions =
  | "exercise"
  | "healthy food"
  | "good sleep"
  | "socialising"
  | "couldn't sleep"
  | "unhealthy food";

type FlowOptions = "none" | "spotting" | "light" | "medium" | "heavy";

export type EmojiQuestionOptions = {
  mood: Record<MoodOptions, string>;
  body: Record<BodyOptions, string>;
  activity: Record<ActivityOptions, string>;
  flow: Record<FlowOptions, string>;
};

export type EmojiQuestionsState = {
  mood?: MoodOptions[];
  body?: BodyOptions[];
  activity?: ActivityOptions[];
  flow?: FlowOptions[];
};

export type EmojiTopicTextOptions = {
  title: string;
  description: string;
  question: string;
};

export type EmojiTopicTexts = {
  mood: EmojiTopicTextOptions;
  body: EmojiTopicTextOptions;
  activity: EmojiTopicTextOptions;
  flow: EmojiTopicTextOptions;
};
