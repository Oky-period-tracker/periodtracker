import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../../../../components/Button";
import { useSignUp } from "../SignUpContext";
import { Checkbox } from "../../../../../components/Checkbox";

export const AskAgree = () => {
  const { state, dispatch } = useSignUp();
  const toggleAgree = () => dispatch({ type: "agree", value: !state.agree });

  return (
    <View style={styles.container}>
      {/* TODO: links */}
      <Text>
        Please ready and agree to the Privacy Policy and Terms and Conditions
        before you continue
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
