import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Vr } from "../../../../../components/Vr";
import { useJourney } from "../JourneyContext";

type Status = "unknown" | "no" | "yes";

export const AskFirst = () => {
  const { state, dispatch } = useJourney();
  const [status, setStatus] = React.useState<Status>("unknown");

  const onNo = () => setStatus("no");
  const onYes = () => setStatus("yes");

  const onConfirm = () => {
    if (status === "no") {
      dispatch({ type: "skip" });
      return;
    }

    dispatch({ type: "continue" });
  };

  React.useEffect(() => {
    // Reset
    setStatus("unknown");
  }, [state.stepIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.question}>Have you had your first period yet?</Text>
        {status === "yes" && (
          <Text style={styles.response}>
            Ok! In that case Oky can help you track and predict your periods.
          </Text>
        )}
        {status === "no" && (
          <Text style={styles.response}>
            That's ok! You can still use Oky to learn about periods and feel
            confident when the time comes.
          </Text>
        )}
      </View>

      <View style={styles.buttons}>
        {status === "unknown" ? (
          <>
            <TouchableOpacity onPress={onNo} style={styles.button}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <Vr />
            <TouchableOpacity onPress={onYes} style={styles.button}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={onConfirm} style={styles.button}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  body: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  question: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  response: {
    textAlign: "center",
    fontSize: 14,
  },
  buttons: {
    alignSelf: "flex-end",
    width: "100%",
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  button: {
    flex: 1,
    padding: 24,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
});
