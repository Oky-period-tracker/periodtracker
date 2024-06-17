import React from "react";
import { Survey, SurveyQuestion, surveys } from "../../../../data/data";

type SurveyAnswer = {
  questionId: string;
  answerID: string;
  answer: string;
};

type SurveyState = {
  survey: Survey | null;
  agree: boolean | null;
  consented: boolean | null;
  questionIndex: number;
  answerIndex: number | null;
  answers: SurveyAnswer[];
  notes: string;
  finished: boolean;
};

type Action<T extends keyof SurveyState = keyof SurveyState> =
  | {
      type: T;
      value: SurveyState[T];
    }
  | {
      type: "select_answer";
      value: number;
    }
  | {
      type: "continue";
    };

const initialState: SurveyState = {
  survey: null,
  agree: null,
  consented: false,
  questionIndex: 0,
  answerIndex: null,
  answers: [],
  notes: "",
  finished: false,
};

function reducer(state: SurveyState, action: Action): SurveyState {
  switch (action.type) {
    case "continue": {
      if (!state.consented && state.agree !== null) {
        return {
          ...state,
          consented: state.agree,
          finished: !state.agree,
        };
      }

      const nextQuestionIndex = getNextSurveyQuestionIndex(state);

      if (nextQuestionIndex >= state.survey.questions.length) {
        // TODO: Save answers to redux
        // TODO: Go to DayTracker after continue again after thanks
        return {
          ...state,
          finished: true,
        };
      }

      return {
        ...state,
        questionIndex: nextQuestionIndex,
        answerIndex: null,
      };
    }

    default:
      return {
        ...state,
        [action.type]: action.value,
      };
  }
}

export type SurveyContext = {
  state: SurveyState;
  dispatch: React.Dispatch<Action>;
};

const defaultValue: SurveyContext = {
  state: initialState,
  dispatch: () => {
    //
  },
};

const SurveyContext = React.createContext<SurveyContext>(defaultValue);

export const SurveyProvider = ({ children }: React.PropsWithChildren) => {
  // TODO: get survey from redux
  const survey = surveys[0];

  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    survey,
  });

  return (
    <SurveyContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  return React.useContext(SurveyContext);
};

export const getSurveyQuestionOptions = (question: SurveyQuestion) => {
  // Convert [{ option1: string }, { option2:string }] to string[]
  return question.options.map((option) => Object.values(option)[0]);
};

const getNextSurveyQuestionIndex = (state: SurveyState) => {
  const currentQuestion = state.survey.questions[state.questionIndex];

  // Convert { option1: string, option2:string } to string[]
  const nextQuestions = Object.values(currentQuestion.next_question).map(
    (option) => Object.values(option)[0]
  );

  const nextQuestion = nextQuestions[state.answerIndex];

  const nextQuestionIndex = nextQuestion
    ? parseInt(nextQuestion) - 1 // -1 because next_question numbers start at 1 not 0
    : state.questionIndex + 1; // default to next

  return nextQuestionIndex;
};
