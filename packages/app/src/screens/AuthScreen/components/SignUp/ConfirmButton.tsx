import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSignUp } from "./SignUpContext";

export const ConfirmButton = () => {
  const { dispatch, canContinue } = useSignUp();

  const onPress = () => dispatch({ type: "increment_step" });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!canContinue}
      style={styles.confirm}
    >
      <Text style={styles.confirmText}>Confirm</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  confirm: {
    padding: 24,
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
