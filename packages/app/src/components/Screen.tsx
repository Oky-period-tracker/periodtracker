import { StyleSheet, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Screen = ({ children, style, ...props }: ViewProps) => {
  return (
    <View style={[styles.screen, style]} {...props}>
      {children}
    </View>
  );
};

export const SafeScreen = ({ children, style, ...props }: ViewProps) => {
  return (
    <SafeAreaView style={[styles.screen, style]} {...props}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    maxWidth: 800,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 12,
  },
});
