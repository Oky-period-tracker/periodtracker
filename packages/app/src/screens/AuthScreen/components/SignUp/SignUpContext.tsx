import React from "react";
import { User } from "../../../../types";
import { FAST_SIGN_UP } from "../../../../config/env";
import { useAuthMode } from "../../AuthModeContext";

export type SignUpStep =
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

type SignUpState = Omit<User, "id" | "dateSignedUp" | "isGuest"> & {
  stepIndex: number;
  agree: boolean;
  passwordConfirm: string;
  month?: number;
  year?: number;
  errorsVisible: boolean;
};

type Action<T extends keyof SignUpState = keyof SignUpState> =
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
  month: null,
  year: null,
  metadata: {
    isProfileUpdateSkipped: true, // Default true for new users
  },
};

const prefilledState: SignUpState = {
  stepIndex: 0,
  agree: true,
  errorsVisible: false,
  name: "aaa",
  password: "aaa",
  passwordConfirm: "aaa",
  secretQuestion: "favourite_actor",
  secretAnswer: "a",
  gender: "Female",
  location: "Urban",
  country: "AF",
  province: "0",
  month: 1,
  year: 2016,
  dateOfBirth: "2015-12-31T17:00:00.000Z",
  metadata: {
    isProfileUpdateSkipped: true, // Default true for new users
  },
};

const initialState = FAST_SIGN_UP ? prefilledState : defaultState;

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

    case "month": {
      const month = action.value as number;
      if (!state.year) {
        return {
          ...state,
          month,
        };
      }

      const dateOfBirth = getDateOfBirth(state.year, month);

      return {
        ...state,
        month,
        dateOfBirth,
      };
    }

    case "year": {
      const year = action.value as number;
      if (isNaN(state.month)) {
        return {
          ...state,
          year,
        };
      }

      const dateOfBirth = getDateOfBirth(year, state.month);
      return {
        ...state,
        year,
        dateOfBirth,
      };
    }

    case "country":
      return {
        ...state,
        country: action.value as string,
        province: null,
      };

    default:
      return {
        ...state,
        [action.type]: action.value,
      };
  }
}

const getDateOfBirth = (year: number, month: number) => {
  const day = 2; // Prevents it defaulting to 31st of previous month
  return new Date(year, month, day).toISOString();
};

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

    if (!state.gender) {
      isValid = false;
      errors.push("no_gender");
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

  // ========== age ========== //
  if (step === "age") {
    if (!state.year) {
      isValid = false;
      errors.push("no_year");
    }

    if (isNaN(state.month)) {
      isValid = false;
      errors.push("no_month");
    }

    if (!state.dateOfBirth) {
      isValid = false;
    }
  }

  // ========== location ========== //
  if (step === "location") {
    if (!state.country) {
      isValid = false;
      errors.push("no_country");
    }

    if (!state.province) {
      isValid = false;
      errors.push("no_province");
    }

    if (!state.location) {
      isValid = false;
      errors.push("no_location");
    }
  }

  return { isValid, errors };
};

type SignUpContext = {
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
  step: steps[0],
  isValid: false,
  errors: [],
};

const SignUpContext = React.createContext<SignUpContext>(defaultValue);

export const SignUpProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const step = steps[state.stepIndex];
  const { isValid, errors } = validateStep(state, step);

  const { setAuthMode } = useAuthMode();

  // Finish
  React.useEffect(() => {
    if (!step) {
      setAuthMode("avatar_and_theme");
    }
  }, [step]);

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
