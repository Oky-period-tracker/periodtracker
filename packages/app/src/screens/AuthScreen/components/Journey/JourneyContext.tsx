import React from "react";
import { journeyCompletion } from "../../../../redux/actions";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../../contexts/AuthContext";
import moment from "moment";

export type JourneyStep =
  | "first_period"
  | "when_last_period"
  | "number_days"
  | "number_weeks_between";

export const journeySteps: JourneyStep[] = [
  "first_period",
  "when_last_period",
  "number_days",
  "number_weeks_between",
];

type JourneyState = {
  stepIndex: number;
  // Answers
  isActive: boolean;
  startDate: Date;
  periodLength: string | undefined; // days
  cycleLength: string | undefined; // weeks
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

const now = new Date().getTime();
const twoWeeks = 1000 * 60 * 60 * 24 * 7 * 2;
const twoWeeksAgo = new Date(now - twoWeeks);

const initialState: JourneyState = {
  stepIndex: 0,
  isActive: false,
  startDate: twoWeeksAgo,
  periodLength: "5",
  cycleLength: "3",
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
        stepIndex: journeySteps.length - 1,
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
  step: journeySteps[0],
};

const JourneyContext = React.createContext<JourneyContext>(defaultValue);

export const JourneyProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const step = journeySteps[state.stepIndex];

  const reduxDispatch = useDispatch();

  const { setIsLoggedIn } = useAuth();

  // Finish
  React.useEffect(() => {
    if (step || !state.periodLength || !state.cycleLength) {
      return;
    }

    const periodLength = parseInt(state.periodLength);
    const cycleLengthDays = parseInt(state.cycleLength) * 7;
    const cycleLength = cycleLengthDays + periodLength;

    const answers = {
      isActive: state.isActive,
      startDate: moment(state.startDate, "DD-MMM-YYYY"),
      periodLength,
      cycleLength,
    };

    reduxDispatch(journeyCompletion(answers));

    // TODO: wait for success
    setIsLoggedIn(true);
  }, [step]);

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

export const getAnswerForStep = (state: JourneyState, step: JourneyStep) => {
  switch (step) {
    case "first_period":
      return state.isActive ? "Yes" : "No";

    case "when_last_period":
      return state.isActive ? state.startDate.toDateString() : "N/A";

    case "number_days":
      return state.isActive ? state.periodLength : "N/A";

    case "number_weeks_between":
      return state.isActive ? state.cycleLength : "N/A";
  }
};
