import { LayoutRectangle } from 'react-native'
import { TutorialStepConfig } from './TutorialContext'
import { ActivityCardFeature, CalendarFeature, NotesFeature } from './components/TutorialFeature'

export type TutorialTwoStep = 'track' | 'summary' | 'stars' | 'activity' | 'dairy' | 'calendar'

export const tutorialTwoSteps: TutorialTwoStep[] = [
  'track',
  'summary',
  'stars',
  'activity',
  'dairy',
  'calendar',
]

const constants = {
  CARD_SCALED_DIFFERENCE: 44,
  CARD_WIDTH: 220,
  FULL_CARD_WIDTH: 252,
}

export const getTutorialTwoConfig = ({
  topLeftLayout,
  wheelLayout,
  screenWidth,
}: {
  topLeftLayout: LayoutRectangle | undefined
  wheelLayout: LayoutRectangle | undefined
  screenWidth: number
  screenHeight: number
}): Record<TutorialTwoStep, TutorialStepConfig> | undefined => {
  if (!topLeftLayout || !wheelLayout || !screenWidth) {
    return undefined
  }

  return {
    track: {
      rotationAngle: -90,
      translationX: (screenWidth ?? 0) / 2 - 30,
      translationY: (screenWidth ?? 0) / 2,
      title: 'tutorial_9_content',
      text: 'tutorial_9',
      textBoxTop: true,
    },
    summary: {
      rotationAngle: -90,
      translationX: constants.CARD_SCALED_DIFFERENCE,
      translationY: (wheelLayout?.height ?? 0) / 2 - 30, // arrow height
      title: 'tutorial_10_content',
      text: 'tutorial_10',
      textBoxTop: true,
    },
    stars: {
      rotationAngle: -90,
      translationX: constants.CARD_SCALED_DIFFERENCE + constants.CARD_WIDTH - 30,
      translationY: (wheelLayout?.height ?? 0) / 2 - 30, // arrow height
      title: 'tutorial_11_content',
      text: 'tutorial_11',
      textBoxTop: true,
    },
    activity: {
      rotationAngle: 0,
      translationX: screenWidth - 60 - 24,
      translationY: (wheelLayout?.height ?? 0) / 2 - 30, // arrow height
      title: 'tutorial_12_content',
      text: 'tutorial_12',
      feature: ActivityCardFeature,
    },
    dairy: {
      rotationAngle: 0,
      translationX: screenWidth - 60 - 24,
      translationY: (wheelLayout?.height ?? 0) / 2 - 30, // arrow height
      title: 'tutorial_13_content',
      text: 'tutorial_13',
      feature: NotesFeature,
    },
    calendar: {
      rotationAngle: 0,
      translationX: screenWidth / 2 - 30,
      translationY: 0,
      title: 'tutorial_14_content',
      text: 'tutorial_14',
      feature: CalendarFeature,
    },
  }
}
