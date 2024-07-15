import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { JourneyStep, useJourney } from "../JourneyContext";
import { JourneyCollect } from "./JourneyCollect";
import { journeyConfig } from "../journeyConfig";
import { Vr } from "../../../../../components/Vr";
import { Text } from "../../../../../components/Text";

type Status = "unknown" | "no" | "yes";

export const JourneyCard = ({ step }: { step: JourneyStep }) => {
  const { state, dispatch } = useJourney();
  const [status, setStatus] = React.useState<Status>("unknown");

  const { questionText, noText, yesText } = journeyConfig[step];

  const onNo = () => {
    setStatus("no");
  };

  const onYes = () => {
    if (step === "first_period") {
      dispatch({ type: "isActive", value: true });
    }

    setStatus("yes");
  };

  const onConfirm = () => {
    if (step === "first_period" && !state.isActive) {
      dispatch({ type: "skip" });
    }

    dispatch({ type: "continue" });
  };

  React.useEffect(() => {
    // Reset after animation
    const timeout = setTimeout(() => {
      setStatus("unknown");
    }, 300); // Slide animation duration

    return () => {
      clearTimeout(timeout);
    };
  }, [state.stepIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {status === "unknown" && (
          <>
            <Text style={styles.question}>{questionText}</Text>
            <Text style={styles.disclaimer}>
            survey_description
            </Text>
          </>
        )}
        {status === "yes" && (
          <>
            <Text style={styles.response}>{yesText}</Text>
            <JourneyCollect step={step} />
          </>
        )}
        {status === "no" && <Text style={styles.response}>{noText}</Text>}
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
  disclaimer: {
    textAlign: "center",
    fontSize: 10,
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
