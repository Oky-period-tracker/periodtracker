import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { Checkbox } from "../../../../../components/Checkbox";
import { A } from "../../../../../components/A";
import { Text } from "../../../../../components/Text";
import { useNavigation } from "@react-navigation/native";

export const AskAgree = () => {
  const { state, dispatch } = useSignUp();
  const toggleAgree = () => dispatch({ type: "agree", value: !state.agree });

  const navigation = useNavigation();
  // @ts-expect-error TODO:
  const goToPrivacy = () => navigation.navigate("Privacy");
  // @ts-expect-error TODO:
  const goToTerms = () => navigation.navigate("Terms");

  return (
    <View style={styles.container}>
      <Text>
        <Text>{`Please read and agree to the `}</Text>
        <A onPress={goToPrivacy}>{`Privacy Policy`}</A>
        <Text>{` and `}</Text>
        <A onPress={goToTerms}>{`Terms and Conditions`}</A>
        <Text>{` before you continue`}</Text>
      </Text>
      <Checkbox label={"I agree"} onPress={toggleAgree} checked={state.agree} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    padding: 24,
    alignItems: "center",
  },
  checkWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  checkBox: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  label: {
    fontWeight: "bold",
  },
});
