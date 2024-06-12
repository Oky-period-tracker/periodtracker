import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useJourney, journeySteps, getAnswerForStep } from "../JourneyContext";
import { Hr } from "../../../../../components/Hr";
import { journeyConfig } from "../journeyConfig";
import { DisplayButton } from "../../../../../components/Button";

export const JourneyReview = () => {
  const { state, dispatch } = useJourney();

  const goToStep = (value: number) => {
    dispatch({ type: "stepIndex", value });
  };

  const onConfirm = () => {
    // TODO:
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {journeySteps.map((step, i) => {
          const isLast = i !== journeySteps.length - 1;

          const { questionText, iconName } = journeyConfig[step];

          const onPress = () => {
            goToStep(i);
          };

          return (
            <React.Fragment key={`journey-review-${step}`}>
              <TouchableOpacity onPress={onPress} style={styles.row}>
                <DisplayButton style={styles.iconLeft}>
                  {/* @ts-ignore TODO: */}
                  <FontAwesome size={20} name={iconName} color={"#fff"} />
                </DisplayButton>

                <View style={styles.rowBody}>
                  <Text style={styles.question}>{questionText}</Text>
                  <Text style={styles.answer}>
                    {getAnswerForStep(state, step)}
                  </Text>
                </View>

                <DisplayButton style={styles.iconRight}>
                  <FontAwesome size={12} name={"pencil"} color={"#fff"} />
                </DisplayButton>
              </TouchableOpacity>
              {isLast ? <Hr /> : null}
            </React.Fragment>
          );
        })}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={onConfirm} style={styles.button}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
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
  row: {
    paddingVertical: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  rowBody: {
    flex: 1,
    marginHorizontal: 8,
  },
  question: {
    fontSize: 12,
  },
  answer: {
    fontWeight: "bold",
  },
  iconLeft: {
    width: 40,
    height: 40,
  },
  iconRight: {
    width: 24,
    height: 24,
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