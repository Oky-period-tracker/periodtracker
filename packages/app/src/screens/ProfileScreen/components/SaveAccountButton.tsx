import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../../components/Button";
import { convertGuestAccount } from "../../../redux/actions";
import { useSelector } from "../../../redux/useSelector";
import { authError, currentUserSelector } from "../../../redux/selectors";
import { ErrorText } from "../../../components/ErrorText";
import { StyleSheet, View } from "react-native";

export const SaveAccountButton = () => {
  const currentUser = useSelector(currentUserSelector);
  // TODO:
  // eslint-disable-next-line
  const errorCode: any = useSelector(authError);
  const dispatch = useDispatch();

  const [errorsVisible, setErrorsVisible] = React.useState(false);
  const showError = errorsVisible && errorCode;

  const onPress = () => {
    setErrorsVisible(true);
    if (!currentUser) {
      return;
    }

    dispatch(convertGuestAccount(currentUser));
  };

  return (
    <View style={styles.wrapper}>
      <Button onPress={onPress} style={styles.button}>
        connect_account
      </Button>
      {showError && (
        <ErrorText style={styles.error}>
          {/* TODO: what error codes are actually used? */}
          {errorCode === 409 ? "error_same_name" : "error_connect_guest"}
        </ErrorText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
  },
  button: {
    width: 140,
  },
  error: {
    marginTop: 12,
  },
});
