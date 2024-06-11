import { generateRange } from "../../../../services/utils";
import { JourneyStep } from "./JourneyContext";

type JourneyConfig = {
  questionText: string;
  yesText: string;
  noText: string;
  iconName: string;
};

export const journeyConfig: Record<JourneyStep, JourneyConfig> = {
  first_period: {
    questionText: "Have you had your first period yet?",
    yesText:
      "Ok! In that case Oky can help you track and predict your periods.",
    noText:
      "That's ok! You can still use Oky to learn about periods and feel confident when the time comes.",
    iconName: "flag",
  },
  when_last_period: {
    questionText: "Do you remember when your last period started?",
    yesText: "What date was it?",
    noText:
      "No problem! That's why Oky's here to help you keep track! For now, let's say it was about 2 weeks ago. You can change it later if you want to.",
    iconName: "calendar",
  },
  number_days: {
    questionText: "Do you remember how many days your last period lasted?",
    yesText: "Ok, how many days was it?",
    noText:
      "No problem! We'll track it together for your next period. For now let's say 5 days long. You can change it later if you want to.",
    iconName: "clock-o",
  },
  number_weeks_between: {
    questionText: "Do you know the number of weeks between your periods?",
    yesText: "Select the number of weeks.",
    noText:
      "No problem! Oky can help you track this. There's usually a 3 week gap between your periods, so let's say this for now. You can make this more accurate once you start tracking!",
    iconName: "list-alt",
  },
};

const DAYS_MIN = 1;
const DAYS_MAX = 10;
const WEEKS_MIN = 1;
const WEEKS_MAX = 6;

const days = generateRange(DAYS_MIN, DAYS_MAX);
const weeks = generateRange(WEEKS_MIN, WEEKS_MAX);

export const dayOptions = days.map((item) => ({
  label: `${item} days`,
  value: item,
}));

export const weekOptions = weeks.map((item) => ({
  label: `${item} weeks`,
  value: item,
}));
