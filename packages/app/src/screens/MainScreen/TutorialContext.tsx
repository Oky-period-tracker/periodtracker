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

export type TutorialStep =
  | "avatar"
  | "wheel"
  | "center_card"
  | "wheel_button"
  | "colors"
  | "verify"
  | "predicted"
  | "period"
  | "no_period";

export const tutorialSteps: TutorialStep[] = [
  "avatar",
  "wheel",
  "center_card",
  "wheel_button",
  "colors",
  "verify",
  "predicted",
  "period",
  "no_period",
];

export const configForStep: Record<
  TutorialStep,
  {
    rotationAngle: number;
    translationX: number;
    translationY: number;
    title: string;
    text: string;
  }
> = {
  avatar: {
    rotationAngle: 0,
    translationX: 0,
    translationY: 0,
    title: "tutorial_0_content",
    text: "tutorial_0",
  },
  wheel: {
    rotationAngle: 90,
    translationX: 1,
    translationY: 5,
    title: "tutorial_1_content",
    text: "tutorial_1",
  },
  center_card: {
    rotationAngle: 180,
    translationX: 10,
    translationY: 50,
    title: "tutorial_2_content",
    text: "tutorial_2",
  },
  wheel_button: {
    rotationAngle: 270,
    translationX: 20,
    translationY: 100,
    title: "tutorial_3_content",
    text: "tutorial_3",
  },
  colors: {
    rotationAngle: 0,
    translationX: 5,
    translationY: 500,
    title: "tutorial_4_content",
    text: "tutorial_4",
  },
  verify: {
    rotationAngle: 180,
    translationX: 15,
    translationY: 30,
    title: "tutorial_5_content",
    text: "tutorial_5",
  },
  predicted: {
    rotationAngle: 90,
    translationX: 30,
    translationY: 60,
    title: "tutorial_6_content",
    text: "tutorial_6",
  },
  period: {
    rotationAngle: 270,
    translationX: 50,
    translationY: 200,
    title: "tutorial_7_content",
    text: "tutorial_7",
  },
  no_period: {
    rotationAngle: 0,
    translationX: 20,
    translationY: 400,
    title: "tutorial_8_content",
    text: "tutorial_8",
  },
};

type TutorialState = {
  isActive: boolean;
  stepIndex: number;
};

type Action<T extends keyof TutorialState = keyof TutorialState> =
  | {
      type: T;
      value: TutorialState[T];
    }
  | {
      type: "continue";
    }
  | {
      type: "skip";
    }
  | {
      type: "reset";
    };

const initialState: TutorialState = {
  isActive: true,
  stepIndex: 0,
};

function reducer(state: TutorialState, action: Action): TutorialState {
  switch (action.type) {
    case "continue":
      return {
        ...state,
        stepIndex: state.stepIndex + 1,
      };

    case "skip":
      return {
        ...state,
        stepIndex: tutorialSteps.length - 1,
      };

    case "reset":
      return {
        ...state,
        // isActive: false,
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
  step: TutorialStep;
  translateArrowStyle: AnimatedStyle | undefined;
  rotateArrowStyle: AnimatedStyle | undefined;
  //
  onTopLeftLayout: (event: LayoutChangeEvent) => void;
  onWheelLayout: (event: LayoutChangeEvent) => void;
};

const defaultValue: TutorialContext = {
  state: initialState,
  dispatch: () => {},
  step: tutorialSteps[0],
  translateArrowStyle: undefined,
  rotateArrowStyle: undefined,
  onTopLeftLayout: () => {},
  onWheelLayout: () => {},
};

const TutorialContext = React.createContext<TutorialContext>(defaultValue);

const WheelButtonSize = 52;
const CloudSize = 80 + 16;

export const TutorialProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const step = tutorialSteps[state.stepIndex];

  const { width: screenWidth } = useScreenDimensions();
  const [topLeftLayout, onTopLeftLayout] = useLayout();
  const [wheelLayout, onWheelLayout] = useLayout();

  const configForStep: Record<
    TutorialStep,
    {
      rotationAngle: number;
      translationX: number;
      translationY: number;
      title: string;
      text: string;
    }
  > = {
    avatar: {
      rotationAngle: 0,
      translationX: (topLeftLayout?.width ?? 0) + 12,
      translationY: (topLeftLayout?.height ?? 0) / 4,
      title: "tutorial_0_content",
      text: "tutorial_0",
    },
    wheel: {
      rotationAngle: 180,
      translationX: (topLeftLayout?.width ?? 0) - 60,
      translationY: (wheelLayout?.height ?? 0) / 2 - 30, // arrow height
      title: "tutorial_1_content",
      text: "tutorial_1",
    },
    center_card: {
      rotationAngle: 180,
      translationX: (topLeftLayout?.width ?? 0) + WheelButtonSize,
      translationY: (wheelLayout?.height ?? 0) / 2 - 30, // arrow height
      title: "tutorial_2_content",
      text: "tutorial_2",
    },
    wheel_button: {
      rotationAngle: 180,
      translationX: (topLeftLayout?.width ?? 0) - 60,
      translationY: (wheelLayout?.height ?? 0) / 2 - 30, // arrow height
      title: "tutorial_3_content",
      text: "tutorial_3",
    },
    colors: {
      rotationAngle: 90,
      translationX: screenWidth / 2 - 30,
      translationY: CloudSize * 2,
      title: "tutorial_4_content",
      text: "tutorial_4",
    },
    verify: {
      rotationAngle: 90,
      translationX: screenWidth / 2 - 30,
      translationY: CloudSize * 2,
      title: "tutorial_5_content",
      text: "tutorial_5",
    },
    predicted: {
      rotationAngle: 90,
      translationX: screenWidth / 2 - 30 - CloudSize,
      translationY: CloudSize * 2,
      title: "tutorial_6_content",
      text: "tutorial_6",
    },
    period: {
      rotationAngle: 90,
      translationX: screenWidth / 2 - 30,
      translationY: CloudSize * 2,
      title: "tutorial_7_content",
      text: "tutorial_7",
    },
    no_period: {
      rotationAngle: 90,
      translationX: screenWidth / 2 - 30 + CloudSize,
      translationY: CloudSize * 2,
      title: "tutorial_8_content",
      text: "tutorial_8",
    },
  };

  const rotationAngle = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (step) {
      const config = configForStep[step];
      rotationAngle.value = withTiming(config.rotationAngle);
      translateX.value = withTiming(config.translationX);
      translateY.value = withTiming(config.translationY);
      return;
    }

    if (!state.isActive) {
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
