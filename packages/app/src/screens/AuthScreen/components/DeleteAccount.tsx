import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AuthHeader } from "./AuthHeader";
import { Hr } from "../../../components/Hr";
import { Input } from "../../../components/Input";
import { ErrorText } from "../../../components/ErrorText";
import { Text } from "../../../components/Text";

type RequestStatus = "unknown" | "success" | "fail";

export const DeleteAccount = () => {
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [errorsVisible, setErrorsVisible] = React.useState(false);
  const { errors } = validateCredentials(name, password);

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
      <AuthHeader title={"delete_account"} />
      <View style={styles.container}>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Name"
          errors={errors}
          errorKey={"username_too_short"}
          errorsVisible={errorsVisible}
        />
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          errors={errors}
          errorKey={"password_too_short"}
          errorsVisible={errorsVisible}
        />
        {requestStatus === "fail" && (
          <ErrorText>incorrect</ErrorText>
        )}
      </View>
      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
        <Text style={styles.confirmText}>confirm</Text>
      </TouchableOpacity>
    </>
  );
};

const validateCredentials = (name: string, password: string) => {
  const errors: string[] = [];
  let isValid = true;

  if (name.length < 3) {
    isValid = false;
    errors.push("username_too_short");
  }

  if (password.length < 3) {
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
