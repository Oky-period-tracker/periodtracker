import React from "react";
import { TutorialContainer } from "../../components/TutorialContainer";
import {
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useLayout } from "../../hooks/useLayout";
import { useScreenDimensions } from "../../hooks/useScreenDimensions";
import { LayoutChangeEvent } from "react-native";
import {
  TutorialOneStep,
  getTutorialOneConfig,
  tutorialOneSteps,
} from "./tutorialOne";
import {
  TutorialTwoStep,
  getTutorialTwoConfig,
  tutorialTwoSteps,
} from "./tutorialTwo";

type Tutorial = "tutorial_one" | "tutorial_two";

type TutorialState = {
  tutorial: Tutorial;
  isActive: boolean;
  stepIndex: number;
};

type TutorialStep = TutorialOneStep | TutorialTwoStep;

export type TutorialStepConfig = {
  rotationAngle: number;
  translationX: number;
  translationY: number;
  title: string;
  text: string;
  textBoxTop?: boolean;
  feature?: React.FC;
};

export type TutorialConfig = Record<TutorialStep, TutorialStepConfig>;

type Action<T extends keyof TutorialState = keyof TutorialState> =
  | {
      type: T;
      value: TutorialState[T];
    }
  | {
      type: "continue";
    }
  | {
      type: "reset";
    };

const initialState: TutorialState = {
  tutorial: "tutorial_two",
  isActive: true,
  stepIndex: 0,
};

function reducer(state: TutorialState, action: Action): TutorialState {
  switch (action.type) {
    case "tutorial":
      return {
        ...state,
        tutorial: action.value as Tutorial,
        stepIndex: 0,
      };

    case "continue":
      return {
        ...state,
        stepIndex: state.stepIndex + 1,
      };

    case "reset":
      return {
        ...state,
        isActive: false,
        stepIndex: 0,
      };

    default:
      return {
        ...state,
        [action.type]: action.value,
      };
  }
}

export type TutorialContext = {
  state: TutorialState;
  dispatch: React.Dispatch<Action>;
  step: TutorialStep | undefined;
  stepConfig: TutorialStepConfig | undefined;
  translateArrowStyle: AnimatedStyle | undefined;
  rotateArrowStyle: AnimatedStyle | undefined;
  //
  onTopLeftLayout: (event: LayoutChangeEvent) => void;
  onWheelLayout: (event: LayoutChangeEvent) => void;
};

const defaultValue: TutorialContext = {
  state: initialState,
  dispatch: () => {},
  step: undefined,
  stepConfig: undefined,
  translateArrowStyle: undefined,
  rotateArrowStyle: undefined,
  onTopLeftLayout: () => {},
  onWheelLayout: () => {},
};

const TutorialContext = React.createContext<TutorialContext>(defaultValue);

export const TutorialProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { width: screenWidth, height: screenHeight } = useScreenDimensions();
  const [topLeftLayout, onTopLeftLayout] = useLayout();
  const [wheelLayout, onWheelLayout] = useLayout();

  const steps =
    state.tutorial === "tutorial_one" ? tutorialOneSteps : tutorialTwoSteps;
  const step = steps[state.stepIndex];

  const tutorialConfig =
    state.tutorial === "tutorial_one"
      ? getTutorialOneConfig({
          topLeftLayout,
          wheelLayout,
          screenWidth,
        })
      : getTutorialTwoConfig({
          topLeftLayout,
          wheelLayout,
          screenWidth,
          screenHeight,
        });

  const rotationAngle = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // @ts-expect-error TODO:
  const stepConfig = tutorialConfig?.[step];

  React.useEffect(() => {
    if (stepConfig) {
      rotationAngle.value = withTiming(stepConfig.rotationAngle);
      translateX.value = withTiming(stepConfig.translationX);
      translateY.value = withTiming(stepConfig.translationY);
      return;
    }

    if (!state.isActive || step) {
      return;
    }

    // TODO: update redux state

    dispatch({ type: "reset" });
  });

  const translateArrowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const rotateArrowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationAngle.value}deg` }],
    };
  });

  return (
    <TutorialContext.Provider
      value={{
        state,
        dispatch,
        step,
        stepConfig,
        translateArrowStyle,
        rotateArrowStyle,
        onTopLeftLayout,
        onWheelLayout,
      }}
    >
      {state.isActive ? (
        <TutorialContainer>{children}</TutorialContainer>
      ) : (
        children
      )}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  return React.useContext(TutorialContext);
};
