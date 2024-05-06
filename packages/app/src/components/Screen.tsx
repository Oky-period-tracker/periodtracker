import { StyleSheet, View } from "react-native";

export const Screen = ({ children }: React.PropsWithChildren) => {
  return <View style={styles.screen}>{children}</View>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "red",
    padding: 12,
  },
});
