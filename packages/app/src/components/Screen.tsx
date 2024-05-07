import { StyleSheet, View, ViewProps } from "react-native";

export const Screen = ({ children, style, ...props }: ViewProps) => {
  return (
    <View style={[styles.screen, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "red",
    padding: 12,
  },
});
