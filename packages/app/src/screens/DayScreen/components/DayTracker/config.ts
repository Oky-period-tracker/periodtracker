import { EmojiQuestionOptions, EmojiTopicTexts, QuizStep } from "./types";

export const quizSteps: QuizStep[] = [
  "question ",
  "mood",
  "body",
  "activity",
  "flow",
  "notes",
];

export const emojiOptions: EmojiQuestionOptions = {
  mood: {
    happy: "😊",
    blah: "😑",
    sad: "😔",
    stressed: "😤",
    worried: "😟",
    fabulous: "😎",
  },
  body: {
    tired: "💤",
    cramps: "💥",
    bloating: "🎈",
    spots: "💢",
    headache: "⚡",
    sore_breasts: "🍒",
  },
  activity: {
    exercise: "🏃",
    "healthy food": "🍏",
    "good sleep": "🛏️",
    socialising: "👋",
    "couldn't sleep": "😴",
    "unhealthy food": "🍰",
  },
  flow: {
    none: "🌂",
    spotting: "🔹",
    light: "💧",
    medium: "💦",
    heavy: "☔",
  },
};

export const EmojiCardText: EmojiTopicTexts = {
  mood: {
    title: "Mood",
    description:
      "Tracking how you feel can help you see how your mood is affected by your monthly cycle",
    question: "How did you mostly feel today?",
  },
  body: {
    title: "Body",
    description:
      "Tracking changes in your body (like cramps) can help you see how your cycle affects your body, which means you can plan ahead!",
    question: "How did your body feel today?",
  },
  activity: {
    title: "Activity",
    description:
      "Tracking what you do every day can help you see what makes you feel good!",
    question: "What did you do today",
  },
  flow: {
    title: "Flow",
    description:
      "When you have your period, track your flow (how much blood there is) to help you notice your body's patterns and spot anything unusual",
    question: "How was your flow?",
  },
};
