import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../../../../components/Button";
import { useSignUp } from "../SignUpContext";

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

      <View style={styles.checkWrapper}>
        <Button
          onPress={toggleAgree}
          status={state.agree ? "primary" : "basic"}
          style={styles.checkBox}
        ></Button>
        <Text style={styles.label}>I agree</Text>
      </View>
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
