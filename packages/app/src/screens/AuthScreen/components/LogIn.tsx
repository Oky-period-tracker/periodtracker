import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AuthHeader } from "./AuthHeader";
import { Hr } from "../../../components/Hr";
import { Input } from "../../../components/Input";
import { ErrorText } from "../../../components/ErrorText";
import { useSelector } from "../../../redux/useSelector";
import { authError, currentUserSelector } from "../../../redux/selectors";
import { useAuth } from "../../../contexts/AuthContext";
import { formatPassword } from "../../../services/auth";
import { useDispatch } from "react-redux";
import { loginRequest } from "../../../redux/actions";
import { Text } from "../../../components/Text";

export const LogIn = () => {
  const user = useSelector(currentUserSelector);
  const dispatch = useDispatch();
  const { setIsLoggedIn } = useAuth();

  const [name, setName] = React.useState(user ? user.name : "");
  const [password, setPassword] = React.useState("");

  const reduxAuthError = useSelector(authError);
  const [errorsVisible, setErrorsVisible] = React.useState(false);
  const { errors } = validateCredentials(name, password);

  const [success, setSuccess] = React.useState<boolean | null>(null);

  const onConfirm = () => {
    if (errors.length) {
      setErrorsVisible(true);
      return;
    }

    if (user) {
      const formattedPassword = formatPassword(password);
      const success = user.password === formattedPassword;
      if (success) {
        setIsLoggedIn(true);
        return;
      }

      // TODO: Set redux state instead of local state ? Or make ErrorProvider
      // dispatch(setAuthError({ error: errorStatusCode }))
      setSuccess(false);
      return;
    }

    dispatch(loginRequest({ name, password: formatPassword(password) }));
  };

  return (
    <>
      <AuthHeader title={"Log in"} />
      <View style={styles.container}>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Name"
          errors={errors}
          errorKey={"name_too_short"}
          errorsVisible={errorsVisible}
          editable={!user}
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
        {success === false && (
          <ErrorText>Incorrect username or password</ErrorText>
        )}
        {reduxAuthError && <ErrorText>{reduxAuthError}</ErrorText>}
      </View>
      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </>
  );
};

const validateCredentials = (name: string, password: string) => {
  const errors: string[] = [];
  let isValid = true;

  if (name.length < 3) {
    isValid = false;
    errors.push("name_too_short");
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
