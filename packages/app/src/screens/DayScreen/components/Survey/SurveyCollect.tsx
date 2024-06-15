import React from "react";
import { Checkbox } from "../../../../components/Checkbox";
import { Input } from "../../../../components/Input";
import { getSurveyQuestionOptions, useSurvey } from "./SurveyContext";

export const SurveyCollect = () => {
  const { state, dispatch } = useSurvey();

  const onCheckboxPress = (value: number) => {
    dispatch({ type: "answerIndex", value });
  };

  const setNotes = (value: string) => {
    dispatch({ type: "notes", value });
  };

  const currentQuestion = state.survey.questions[state.questionIndex];

  const options = getSurveyQuestionOptions(currentQuestion);

  const isMultiple = currentQuestion?.is_multiple;

  return (
    <>
      {isMultiple ? (
        <>
          {options.map((option, i) => {
            const checked = state.answerIndex === i;
            const onPress = () => {
              onCheckboxPress(i);
            };

            return (
              <Checkbox
                key={`survey-${i}`}
                label={option}
                onPress={onPress}
                checked={checked}
                checkedStatus={"danger"}
                checkedTextStatus={"danger"}
              />
            );
          })}
        </>
      ) : (
        <Input value={state.notes} onChangeText={setNotes} multiline={true} />
      )}
    </>
  );
};
