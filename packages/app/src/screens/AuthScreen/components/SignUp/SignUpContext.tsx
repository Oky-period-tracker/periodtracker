import React, { useReducer } from "react";
import { User } from "../../../../types";

type SignUpStep =
  | "confirmation"
  | "information"
  | "secret"
  | "age"
  | "location";

const steps: SignUpStep[] = [
  "confirmation",
  "information",
  "secret",
  "age",
  "location",
];

export type SignUpState = Omit<User, "id" | "dateSignedUp" | "isGuest"> & {
  stepIndex: number;
  agree: boolean;
  passwordConfirm: string;
};

export type Action<T extends keyof SignUpState = keyof SignUpState> =
  | {
      type: T;
      value: SignUpState[T];
    }
  | {
      type: "increment_step";
    }
  | {
      type: "reset";
    };

const defaultState: SignUpState = {
  stepIndex: 0,
  agree: false,
  name: "",
  password: "",
  passwordConfirm: "",
  secretQuestion: "",
  secretAnswer: "",
  gender: "Female",
  location: "Urban",
  country: null,
  province: null,
  dateOfBirth: "",
  metadata: {
    isProfileUpdateSkipped: true, // Default true for new users
  },
};

function reducer(state: SignUpState, action: Action): SignUpState {
  switch (action.type) {
    case "increment_step": {
      return {
        ...state,
        stepIndex: state.stepIndex + 1,
      };
    }

    case "reset": {
      return {
        ...state,
        stepIndex: state.stepIndex + 1,
      };
    }

    default:
      return {
        ...state,
        [action.type]: action.value,
      };
  }
}

const canContinueReducer = (state: SignUpState, step: SignUpStep) => {
  switch (step) {
    case "confirmation":
      return state.agree;

    default:
      return true;
  }
};

export type SignUpContext = {
  state: SignUpState;
  dispatch: React.Dispatch<Action>;
  step: SignUpStep;
  canContinue: boolean;
};

const defaultValue: SignUpContext = {
  state: defaultState,
  dispatch: () => {
    //
  },
  step: "confirmation",
  canContinue: false,
};

const SignUpContext = React.createContext<SignUpContext>(defaultValue);

export const SignUpProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const step = steps[state.stepIndex];
  const canContinue = canContinueReducer(state, step);

  return (
    <SignUpContext.Provider
      value={{
        state,
        dispatch,
        step,
        canContinue,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  return React.useContext(SignUpContext);
};
