import React from "react";

export type TutorialStep =
  | "first_period"
  | "when_last_period"
  | "number_days"
  | "number_weeks_between";

export const tutorialSteps: TutorialStep[] = [
  "first_period",
  "when_last_period",
  "number_days",
  "number_weeks_between",
];

type TutorialState = {
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
    };

const initialState: TutorialState = {
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
};

const defaultValue: TutorialContext = {
  state: initialState,
  dispatch: () => {
    //
  },
  step: tutorialSteps[0],
};

const TutorialContext = React.createContext<TutorialContext>(defaultValue);

export const TutorialProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const step = tutorialSteps[state.stepIndex];

  return (
    <TutorialContext.Provider
      value={{
        state,
        dispatch,
        step,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  return React.useContext(TutorialContext);
};
