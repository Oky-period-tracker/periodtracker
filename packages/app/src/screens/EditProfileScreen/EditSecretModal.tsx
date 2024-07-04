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
import { WheelPickerModal } from "../../components/WheelPickerModal";
import { questionOptions } from "../../config/options";
import { WheelPickerOption } from "../../components/WheelPicker";

export const EditSecretModal = ({ visible, toggleVisible }: ModalProps) => {
  const currentUser = useSelector(currentUserSelector) as User;
  const appToken = useSelector(appTokenSelector);
  const reduxDispatch = useDispatch();

  const [errorsVisible, setErrorsVisible] = React.useState(false);
  const [previousSecret, setPreviousSecret] = React.useState("");
  const [nextSecret, setNextSecret] = React.useState("");

  const [secretQuestion, setSecretQuestion] = React.useState(
    currentUser.secretQuestion
  );
  const onChangeQuestion = (option: WheelPickerOption | undefined) => {
    if (!option) {
      return;
    }
    setSecretQuestion(option.value);
  };

  const previousFormatted = formatPassword(previousSecret);
  const nextFormatted = formatPassword(nextSecret);
  const { isValid, errors } = validate(
    previousFormatted,
    nextFormatted,
    secretQuestion
  );

  const initialSecretOption = questionOptions.find(
    (item) => item.value === secretQuestion
  );

  const sendRequest = async (
    previousSecretAnswer: string,
    nextSecretAnswer: string
  ) => {
    await httpClient.editUserSecretAnswer({
      appToken,
      previousSecretAnswer,
      nextSecretAnswer,
    });
  };

  const updateReduxState = (secretAnswer: string) => {
    reduxDispatch(editUser({ secretAnswer, secretQuestion }));
  };

  const onConfirm = async () => {
    setErrorsVisible(true);

    if (!isValid) {
      return;
    }

    const hasChanged =
      currentUser.secretAnswer !== nextFormatted ||
      currentUser.secretQuestion !== secretQuestion;
    if (!hasChanged) {
      return;
    }

    if (previousFormatted !== currentUser.secretAnswer) {
      // TODO: show error
      return;
    }

    if (!appToken) {
      updateReduxState(nextFormatted);
      toggleVisible();
      return;
    }

    try {
      await sendRequest(previousFormatted, nextFormatted);
      updateReduxState(nextFormatted);
      toggleVisible();
    } catch (error) {
      // TODO: show alert
    }
  };

  React.useEffect(() => {
    // Reset
    setPreviousSecret("");
    setNextSecret("");
    setSecretQuestion(currentUser.secretQuestion);
    setErrorsVisible(false);
  }, [currentUser]);

  return (
    <Modal visible={visible} toggleVisible={toggleVisible} style={styles.modal}>
      <View style={styles.modalBody}>
        <Input
          value={previousSecret}
          onChangeText={setPreviousSecret}
          placeholder="Secret answer"
          secureTextEntry={true}
          // errors={errors}
          // errorKey={"secret_too_short"}
          // errorsVisible={errorsVisible}
        />
        <WheelPickerModal
          initialOption={initialSecretOption}
          options={questionOptions}
          onSelect={onChangeQuestion}
          placeholder={"Secret Question"}
          errors={errors}
          errorKey={"no_secret_question"}
          errorsVisible={errorsVisible}
          allowUndefined={false}
        />
        <Input
          value={nextSecret}
          onChangeText={setNextSecret}
          placeholder="Secret answer"
          secureTextEntry={true}
          errors={errors}
          errorKey={"secret_too_short"}
          errorsVisible={errorsVisible}
        />
      </View>

      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.modalConfirm}>
        <Text style={styles.modalConfirmText}>Confirm</Text>
      </TouchableOpacity>
    </Modal>
  );
};

const validate = (previous: string, next: string, question: string) => {
  const errors: string[] = [];
  let isValid = true;

  if (previous.length < 1) {
    isValid = false;
    errors.push("secret_too_short");
  }

  if (next.length < 1) {
    isValid = false;
    errors.push("secret_too_short");
  }

  if (!question) {
    isValid = false;
    errors.push("no_secret_question");
  }

  return { isValid, errors };
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
