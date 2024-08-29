import { JourneyStep } from './JourneyContext'

type JourneyConfig = {
  questionText: string
  yesText: string
  noText: string
  iconName: string
}

export const journeyConfig: Record<JourneyStep, JourneyConfig> = {
  first_period: {
    questionText: 'survey_question_1',
    yesText: 'survey_default_answer_1_1',
    noText: 'survey_default_answer_1',
    iconName: 'flag',
  },
  when_last_period: {
    questionText: 'survey_question_2',
    yesText: 'survey_label_2',
    noText: 'survey_default_answer_2',
    iconName: 'calendar',
  },
  number_days: {
    questionText: 'survey_question_3',
    yesText: 'survey_label_3',
    noText: 'survey_default_answer_3',
    iconName: 'clock-o',
  },
  number_weeks_between: {
    questionText: 'survey_question_4',
    yesText: 'survey_label_4',
    noText: 'survey_default_answer_4',
    iconName: 'list-alt',
  },
}
