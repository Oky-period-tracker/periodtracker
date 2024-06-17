import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { Input } from "../../../../../components/Input";
import { ModalSelector } from "../../../../../components/ModalSelector";

// TODO: move somewhere else?
const secretQuestions = [
  // "secret_question",
  `favourite_actor`,
  `favourite_teacher`,
  `childhood_hero`,
];

const questionOptions = secretQuestions.map((item) => ({
  label: item,
  value: item,
}));

export const AskSecret = () => {
  const { state, dispatch, errors } = useSignUp();

  const onChangeAnswer = (value: string) =>
    dispatch({ type: "secretAnswer", value });

  const onChangeQuestion = (value: string) =>
    dispatch({ type: "secretQuestion", value });

  return (
    <View style={styles.container}>
      <ModalSelector
        displayValue={state.secretQuestion}
        options={questionOptions}
        onSelect={onChangeQuestion}
        placeholder={"Secret Question"}
        errors={errors}
        errorKey={"no_secret_question"}
        errorsVisible={state.errorsVisible}
      />
      <Input
        value={state.secretAnswer}
        onChangeText={onChangeAnswer}
        placeholder="Answer"
        errors={errors}
        errorKey={"secret_too_short"}
        errorsVisible={state.errorsVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
