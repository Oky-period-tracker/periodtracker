import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthHeader } from "./AuthHeader";
import { Hr } from "../../../components/Hr";
import { Input } from "../../../components/Input";
import { ErrorText } from "../../../components/ErrorText";

type RequestStatus = "unknown" | "success" | "fail";

export const ForgotPassword = () => {
  const [name, setName] = React.useState("");
  const [answer, setAnswer] = React.useState("");

  const [errorsVisible, setErrorsVisible] = React.useState(false);
  const { errors } = validateCredentials(name, answer);

  const [requestStatus, setRequestStatus] =
    React.useState<RequestStatus>("unknown");

  const onConfirm = () => {
    if (errors.length) {
      setErrorsVisible(true);
      return;
    }

    // TODO:
    setRequestStatus("fail");
  };

  return (
    <>
      <AuthHeader title={"Forgot password"} />
      <View style={styles.container}>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Name"
          errors={errors}
          errorKey={"name_too_short"}
          errorsVisible={errorsVisible}
        />
        <Input
          value={answer}
          onChangeText={setAnswer}
          placeholder="Secret answer"
          errors={errors}
          errorKey={"password_too_short"}
          errorsVisible={errorsVisible}
        />
        {requestStatus === "fail" && (
          <ErrorText>Incorrect username or answer</ErrorText>
        )}
      </View>
      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </>
  );
};

const validateCredentials = (name: string, answer: string) => {
  const errors: string[] = [];
  let isValid = true;

  if (name.length < 3) {
    isValid = false;
    errors.push("name_too_short");
  }

  if (answer.length < 1) {
    isValid = false;
    errors.push("password_too_short");
  }

  return { isValid, errors };
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  confirm: {
    padding: 24,
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
