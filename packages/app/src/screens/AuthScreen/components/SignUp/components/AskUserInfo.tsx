import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { Input } from "../../../../../components/Input";
import { SegmentControl } from "../../../../../components/SegmentControl";

const genders = [
  { value: "Female", label: "Female", iconName: "female" },
  { value: "Male", label: "Male", iconName: "male" },
  { value: "Other", label: "Other", iconName: "genderless" },
];

export const AskUserInfo = () => {
  const { state, dispatch, errors } = useSignUp();

  const onChangeName = (value: string) => {
    dispatch({ type: "name", value });
  };

  const onChangeGender = (value: string) => {
    dispatch({ type: "gender", value });
  };

  const onChangePassword = (value: string) => {
    dispatch({ type: "password", value });
  };

  const onChangeConfirmPassword = (value: string) => {
    dispatch({ type: "passwordConfirm", value });
  };

  return (
    <View style={styles.container}>
      <Input
        value={state.name}
        onChangeText={onChangeName}
        placeholder="Name"
        errors={errors}
        errorKey={"name_too_short"}
        errorsVisible={state.errorsVisible}
      />
      <SegmentControl
        options={genders}
        selected={state.gender}
        onSelect={onChangeGender}
        errors={errors}
        errorKey={"no_gender"}
        errorsVisible={state.errorsVisible}
      />
      <Input
        value={state.password}
        onChangeText={onChangePassword}
        placeholder="Password"
        secureTextEntry={true}
        errors={errors}
        errorKey={"password_too_short"}
        errorsVisible={state.errorsVisible}
      />
      <Input
        value={state.passwordConfirm}
        onChangeText={onChangeConfirmPassword}
        placeholder="Confirm password"
        secureTextEntry={true}
        errors={errors}
        errorKey={"passwords_dont_match"}
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
