import { LayoutRectangle } from 'react-native'
import { TutorialStepConfig } from './TutorialContext'
import { ActivityCardFeature, CalendarFeature, NotesFeature } from './components/TutorialFeature'
import { UIConfig } from '../../config/UIConfig'

export type TutorialTwoStep = 'track' | 'summary' | 'stars' | 'activity' | 'dairy' | 'calendar'

export const tutorialTwoSteps: TutorialTwoStep[] = [
  'track',
  'summary',
  'stars',
  'activity',
  'dairy',
  'calendar',
]

const SELECTED_SCALE = 1.2

export const getTutorialTwoConfig = ({
  topLeftLayout,
  wheelLayout,
  screenWidth,
  config,
}: {
  topLeftLayout: LayoutRectangle | undefined
  wheelLayout: LayoutRectangle | undefined
  screenWidth: number
  config: UIConfig
}): Record<TutorialTwoStep, TutorialStepConfig> | undefined => {
  if (!topLeftLayout || !wheelLayout || !screenWidth) {
    return undefined
  }

  const CARD_WIDTH = config.carousel.cardWidth
  const CARD_MARGIN = config.carousel.cardMargin
  const FULL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN
  const SELECTED_WIDTH = CARD_WIDTH * SELECTED_SCALE
  const FULL_SELECTED_WIDTH = SELECTED_WIDTH + CARD_MARGIN
  const CARD_SCALED_DIFFERENCE = FULL_SELECTED_WIDTH - FULL_CARD_WIDTH

  return {
    track: {
      rotationAngle: -90,
      translationX: screenWidth / 2 - 30,
      translationY: screenWidth / 2,
      title: 'tutorial_9_content',
      text: 'tutorial_9',
      textBoxTop: true,
    },
    summary: {
      rotationAngle: -90,
      translationX: CARD_SCALED_DIFFERENCE,
      translationY: wheelLayout?.height / 2 - 30, // arrow height
      title: 'tutorial_10_content',
      text: 'tutorial_10',
      textBoxTop: true,
    },
    stars: {
      rotationAngle: -90,
      translationX: CARD_SCALED_DIFFERENCE + CARD_WIDTH - 30,
      translationY: wheelLayout?.height / 2 - 30, // arrow height
      title: 'tutorial_11_content',
      text: 'tutorial_11',
      textBoxTop: true,
    },
    activity: {
      rotationAngle: 0,
      translationX: screenWidth - 60 - 24,
      translationY: wheelLayout?.height / 2 - 30, // arrow height
      textBoxTop: true,
      title: 'tutorial_12_content',
      text: 'tutorial_12',
      feature: ActivityCardFeature,
    },
    dairy: {
      rotationAngle: 0,
      translationX: screenWidth - 60 - 24,
      translationY: wheelLayout?.height / 2 - 30, // arrow height
      title: 'tutorial_13_content',
      text: 'tutorial_13',
      feature: NotesFeature,
      textBoxTop: true,
    },
    calendar: {
      rotationAngle: -90,
      translationX: screenWidth / 2 - 30,
      translationY: 10, // Adjust to align properly below the calendar
      title: 'tutorial_14_content',
      text: 'tutorial_14',
      feature: CalendarFeature,
      textBoxTop: false,
    },
  }
}
