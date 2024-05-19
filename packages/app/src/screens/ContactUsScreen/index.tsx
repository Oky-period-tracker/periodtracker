import * as React from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { ScreenComponent } from "../../navigation/RootNavigator";

const ContactUsScreen: ScreenComponent<"Contact"> = () => {
  const [reason, setReason] = React.useState("");
  const [message, setMessage] = React.useState("");

  return (
    <Screen>
      <View style={styles.container}>
        <TextInput
          placeholder="reason"
          style={styles.input}
          onChangeText={setReason}
          value={reason}
        />
        <TextInput
          placeholder="message"
          style={styles.input}
          onChangeText={setMessage}
          value={message}
          multiline={true}
          numberOfLines={5}
        />
        <Button>Send</Button>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    margin: 8,
    width: "100%",
    borderRadius: 8,
  },
});
