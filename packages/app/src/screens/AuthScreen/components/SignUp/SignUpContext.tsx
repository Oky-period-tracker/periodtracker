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
  errorsVisible: boolean;
};

export type Action<T extends keyof SignUpState = keyof SignUpState> =
  | {
      type: T;
      value: SignUpState[T];
    }
  | {
      type: "continue";
    };

const defaultState: SignUpState = {
  stepIndex: 0,
  agree: false,
  errorsVisible: false,
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
    case "continue": {
      const step = steps[state.stepIndex];
      const { isValid } = validateStep(state, step);

      if (!isValid) {
        return {
          ...state,
          errorsVisible: true,
        };
      }

      return {
        ...state,
        stepIndex: state.stepIndex + 1,
        errorsVisible: false,
      };
    }

    default:
      return {
        ...state,
        [action.type]: action.value,
      };
  }
}

const validateStep = (
  state: SignUpState,
  step: SignUpStep
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  let isValid = true;

  // ========== confirmation ========== //
  if (step === "confirmation") {
    if (!state.agree) {
      isValid = false;
    }
  }

  // ========== information ========== //
  if (step === "information") {
    if (state.name.length < 3) {
      // TODO: check availability
      isValid = false;
      errors.push("name_too_short");
    }

    if (state.password.length < 3) {
      isValid = false;
      errors.push("password_too_short");
    }

    if (state.password !== state.passwordConfirm) {
      isValid = false;
      errors.push("passwords_dont_match");
    }
  }

  // ========== secret ========== //
  if (step === "secret") {
    if (!state.secretQuestion) {
      isValid = false;
      errors.push("no_secret_question");
    }

    if (state.secretAnswer.length < 1) {
      isValid = false;
      errors.push("secret_too_short");
    }
  }

  return { isValid, errors };
};

export type SignUpContext = {
  state: SignUpState;
  dispatch: React.Dispatch<Action>;
  step: SignUpStep;
  isValid: boolean;
  errors: string[]; // TODO:
};

const defaultValue: SignUpContext = {
  state: defaultState,
  dispatch: () => {
    //
  },
  step: "confirmation",
  isValid: false,
  errors: [],
};

const SignUpContext = React.createContext<SignUpContext>(defaultValue);

export const SignUpProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const step = steps[state.stepIndex];
  const { isValid, errors } = validateStep(state, step);

  return (
    <SignUpContext.Provider
      value={{
        state,
        dispatch,
        step,
        isValid,
        errors,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  return React.useContext(SignUpContext);
};
