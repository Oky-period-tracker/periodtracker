import React from "react";

export type JourneyStep =
  | "first_period"
  | "when_last_period"
  | "number_days"
  | "number_weeks_between";

const steps: JourneyStep[] = [
  "first_period",
  "when_last_period",
  "number_days",
  "number_weeks_between",
];

type JourneyState = {
  stepIndex: number;
};

type Action<T extends keyof JourneyState = keyof JourneyState> =
  | {
      type: T;
      value: JourneyState[T];
    }
  | {
      type: "continue";
    };

const initialState: JourneyState = {
  stepIndex: 0,
};

function reducer(state: JourneyState, action: Action): JourneyState {
  switch (action.type) {
    case "continue":
      return {
        ...state,
        stepIndex: state.stepIndex + 1,
      };

    default:
      return {
        ...state,
        [action.type]: action.value,
      };
  }
}

export type JourneyContext = {
  state: JourneyState;
  dispatch: React.Dispatch<Action>;
  step: JourneyStep;
};

const defaultValue: JourneyContext = {
  state: initialState,
  dispatch: () => {
    //
  },
  step: steps[0],
};

const JourneyContext = React.createContext<JourneyContext>(defaultValue);

export const JourneyProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const step = steps[state.stepIndex];

  return (
    <JourneyContext.Provider
      value={{
        state,
        dispatch,
        step,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  return React.useContext(JourneyContext);
};
