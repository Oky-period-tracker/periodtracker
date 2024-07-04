import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Modal, ModalProps } from "../../components/Modal";
import { Hr } from "../../components/Hr";
import { Text } from "../../components/Text";
import { Input } from "../../components/Input";
import { useSelector } from "../../redux/useSelector";
import { appTokenSelector, currentUserSelector } from "../../redux/selectors";
import { User } from "../../redux/reducers/authReducer";
import { httpClient } from "../../services/HttpClient";
import { useDispatch } from "react-redux";
import { editUser } from "../../redux/actions";
import { formatPassword } from "../../services/auth";

export const EditPasswordModal = ({ visible, toggleVisible }: ModalProps) => {
  const currentUser = useSelector(currentUserSelector) as User;
  const name = currentUser.name;
  const appToken = useSelector(appTokenSelector);
  const reduxDispatch = useDispatch();

  const [secret, setSecret] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const sendRequest = async (password: string, secretAnswer: string) => {
    await httpClient.resetPassword({
      name,
      secretAnswer,
      password,
    });
  };

  const updateReduxState = (password: string) => {
    reduxDispatch(
      editUser({
        password,
      })
    );
  };

  const onConfirm = async () => {
    const formattedPassword = formatPassword(newPassword);
    const formattedSecret = formatPassword(secret);

    // TODO: validate

    if (!appToken) {
      updateReduxState(formattedPassword);
      toggleVisible();
      return;
    }

    try {
      await sendRequest(formattedPassword, formattedSecret);
      updateReduxState(formattedPassword);
      toggleVisible();
    } catch (error) {
      // TODO: show alert
    }
  };

  return (
    <Modal visible={visible} toggleVisible={toggleVisible} style={styles.modal}>
      <View style={styles.modalBody}>
        <Input
          value={secret}
          onChangeText={setSecret}
          placeholder="Secret answer"
          secureTextEntry={true}
          // errors={errors}
          // errorKey={"password_too_short"}
          // errorsVisible={state.errorsVisible}
        />

        <Input
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password"
          secureTextEntry={true}
          // errors={errors}
          // errorKey={"password_too_short"}
          // errorsVisible={state.errorsVisible}
        />
      </View>

      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.modalConfirm}>
        <Text style={styles.modalConfirmText}>Confirm</Text>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  modalBody: {
    paddingVertical: 24,
    paddingHorizontal: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  modalConfirm: {
    padding: 24,
  },
  modalConfirmText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
