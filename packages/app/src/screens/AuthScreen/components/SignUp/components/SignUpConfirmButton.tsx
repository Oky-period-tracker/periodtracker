import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSignUp } from "../SignUpContext";

export const SignUpConfirmButton = () => {
  const { dispatch } = useSignUp();

  const onPress = () => dispatch({ type: "continue" });

  return (
    <TouchableOpacity onPress={onPress} style={styles.confirm}>
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