import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { Checkbox } from "../../../../../components/Checkbox";
import { A } from "../../../../../components/A";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../../../../../components/Text";

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
        <Text>accept_conditions_1</Text>
        <A onPress={goToPrivacy}>accept_conditions_2</A>
        <Text>accept_conditions_3</Text>
        <A onPress={goToTerms}>accept_conditions_4</A>
        <Text>accept_conditions_5</Text>
      </Text>
      <Checkbox label={"i_agree"} onPress={toggleAgree} checked={state.agree} />
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
