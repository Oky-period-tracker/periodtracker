import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { ErrorText } from "../../../../../components/ErrorText";
import { Input } from "../../../../../components/Input";

export const AskUserInfo = () => {
  const { state, dispatch, errors } = useSignUp();

  const onChangeName = (value: string) => dispatch({ type: "name", value });
  const onChangePassword = (value: string) =>
    dispatch({ type: "password", value });
  const onChangeConfirmPassword = (value: string) =>
    dispatch({ type: "passwordConfirm", value });

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
  input: {
    margin: 8,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    padding: 12,
  },
});
