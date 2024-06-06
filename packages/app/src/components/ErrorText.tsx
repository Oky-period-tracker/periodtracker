import { StyleSheet, Text, TextProps } from "react-native";

export const ErrorText = ({ style, children, ...props }: TextProps) => {
  return (
    <Text style={[styles.error, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "#ff0000",
    fontSize: 10,
    textAlign: "center",
  },
});
