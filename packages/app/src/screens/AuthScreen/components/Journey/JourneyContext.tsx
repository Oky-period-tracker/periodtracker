import React from "react";

export type JourneyStep =
  | "first_period"
  | "when_last_period"
  | "number_days"
  | "number_weeks_between"
  | "review";

const steps: JourneyStep[] = [
  "first_period",
  "when_last_period",
  "number_days",
  "number_weeks_between",
  "review",
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
    }
  | {
      type: "skip";
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

    case "skip":
      return {
        ...state,
        stepIndex: steps.length - 1,
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
};

const defaultValue: JourneyContext = {
  state: initialState,
  dispatch: () => {
    //
  },
};

const JourneyContext = React.createContext<JourneyContext>(defaultValue);

export const JourneyProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <JourneyContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  return React.useContext(JourneyContext);
};
