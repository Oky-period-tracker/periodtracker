import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { useToggle } from "../../hooks/useToggle";
import { httpClient } from "../../services/HttpClient";
import { Modal } from "../../components/Modal";
import { Text } from "../../components/Text";
import { palette } from "../../config/theme";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  currentLocaleSelector,
  currentUserSelector,
} from "../../redux/selectors";
import { ErrorText } from "../../components/ErrorText";
import { Input } from "../../components/Input";

const ContactUsScreen: ScreenComponent<"Contact"> = () => {
  const user = useSelector(currentUserSelector);
  const locale = useSelector(currentLocaleSelector);

  const [reason, setReason] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState(false);

  const invalid = reason === "" || reason === "reason" || message === "";

  const [visible, toggleVisible] = useToggle();

  const send = async () => {
    if (invalid) {
      return;
    }

    try {
      setError(false);

      await httpClient.sendContactUsForm({
        name: user?.name,
        dateRec: moment().utc().startOf("day"),
        organization: "user",
        platform: "mobile",
        reason,
        email: "NA",
        status: "open",
        content: message,
        lang: locale,
      });

      setMessage("");
      toggleVisible();
    } catch (err) {
      setError(true);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Input placeholder="reason" onChangeText={setReason} value={reason} />
        <Input
          placeholder="message"
          onChangeText={setMessage}
          value={message}
          multiline={true}
        />
        {error && <ErrorText>request_error</ErrorText>}
        <Button
          onPress={send}
          style={styles.button}
          status={invalid ? "basic" : "primary"}
        >
          Send
        </Button>
      </View>

      <Modal
        style={styles.modal}
        visible={visible}
        toggleVisible={toggleVisible}
      >
        <Text style={styles.modalTitle}>Thank you</Text>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
          deleniti enim quo alias. Odit nostrum expedita, ducimus voluptas vero
          totam modi officia reprehenderit.
        </Text>
      </Modal>
    </Screen>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    padding: 24,
    flex: 1,
    maxHeight: 400,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    marginTop: 12,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 48,
  },
  modalTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: palette["primary"].base,
  },
});
