import { LayoutRectangle } from 'react-native'
import { TutorialStepConfig } from './TutorialContext'
import { CloudColors, CloudPrediction } from './components/TutorialFeature'

export type TutorialOneStep =
  | 'avatar'
  | 'wheel'
  | 'center_card'
  | 'wheel_button'
  | 'colors'
  | 'verify'
  | 'predicted'
  | 'period'
  | 'no_period'

export const tutorialOneSteps: TutorialOneStep[] = [
  'avatar',
  'wheel',
  'center_card',
  'wheel_button',
  'colors',
  'verify',
  'predicted',
  'period',
  'no_period',
]

const WheelButtonSize = 52
const CloudSize = 80 + 16

export const getTutorialOneConfig = ({
  topLeftLayout,
  wheelLayout,
  screenWidth,
}: {
  topLeftLayout: LayoutRectangle | undefined
  wheelLayout: LayoutRectangle | undefined
  screenWidth: number
}): Record<TutorialOneStep, TutorialStepConfig> | undefined => {
  if (!topLeftLayout || !wheelLayout || !screenWidth) {
    return undefined
  }

  return {
    avatar: {
      rotationAngle: 0,
      translationX: (topLeftLayout?.width ?? 0) + 12,
      translationY: (topLeftLayout?.height ?? 0) / 4,
      title: 'tutorial_0_content',
      text: 'tutorial_0',
    },
    wheel: {
      rotationAngle: 180,
      translationX: (topLeftLayout?.width ?? 0) - 60,
      translationY: (wheelLayout?.height ?? 0) / 2 - 30, // arrow height
      title: 'tutorial_1_content',
      text: 'tutorial_1',
    },
    center_card: {
      rotationAngle: 180,
      translationX: (topLeftLayout?.width ?? 0) + WheelButtonSize,
      translationY: (wheelLayout?.height ?? 0) / 2 - 30, // arrow height
      title: 'tutorial_2_content',
      text: 'tutorial_2',
    },
    wheel_button: {
      rotationAngle: 180,
      translationX: (topLeftLayout?.width ?? 0) - 60,
      translationY: (wheelLayout?.height ?? 0) / 2 - 30, // arrow height
      title: 'tutorial_3_content',
      text: 'tutorial_3',
    },
    colors: {
      rotationAngle: 90,
      translationX: screenWidth / 2 - 30,
      translationY: CloudSize * 2,
      title: 'tutorial_4_content',
      text: 'tutorial_4',
      feature: CloudColors,
    },
    verify: {
      rotationAngle: 90,
      translationX: screenWidth / 2 - 30,
      translationY: CloudSize * 2,
      title: 'tutorial_5_content',
      text: 'tutorial_5',
      feature: CloudPrediction,
    },
    predicted: {
      rotationAngle: 90,
      translationX: screenWidth / 2 - 30 - CloudSize,
      translationY: CloudSize * 2,
      title: 'tutorial_6_content',
      text: 'tutorial_6',
      feature: CloudPrediction,
    },
    period: {
      rotationAngle: 90,
      translationX: screenWidth / 2 - 30,
      translationY: CloudSize * 2,
      title: 'tutorial_7_content',
      text: 'tutorial_7',
      feature: CloudPrediction,
    },
    no_period: {
      rotationAngle: 90,
      translationX: screenWidth / 2 - 30 + CloudSize,
      translationY: CloudSize * 2,
      title: 'tutorial_8_content',
      text: 'tutorial_8',
      feature: CloudPrediction,
    },
  }
}
