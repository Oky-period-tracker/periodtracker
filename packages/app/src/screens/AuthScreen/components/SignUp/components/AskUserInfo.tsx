import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { Input } from "../../../../../components/Input";
import { SegmentControl } from "../../../../../components/SegmentControl";
import { genders } from "../../../../../config/options";
import { InfoButton } from "../../../../../components/InfoButton";

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
        placeholder="name"
        errors={errors}
        errorKeys={["username_too_short", "name_taken_error"]}
        errorsVisible={state.errorsVisible}
        actionLeft={<InfoButton title={"name"} content={"name_info_label"} />}
      />
      <SegmentControl
        options={genders}
        selected={state.gender}
        onSelect={onChangeGender}
      />
      <Input
        value={state.password}
        onChangeText={onChangePassword}
        placeholder="password"
        secureTextEntry={true}
        errors={errors}
        errorKeys={["password_too_short"]}
        errorsVisible={state.errorsVisible}
        actionLeft={
          <InfoButton
            title={"password_error_heading"}
            content={"password_error_content"}
          />
        }
      />
      <Input
        value={state.passwordConfirm}
        onChangeText={onChangeConfirmPassword}
        placeholder="confirm_password"
        secureTextEntry={true}
        errors={errors}
        errorKeys={["passcodes_mismatch"]}
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
