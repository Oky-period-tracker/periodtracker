import { StyleSheet, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Screen = ({ children, style, ...props }: ViewProps) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={[styles.screen, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    flex: 1,
  },
  screen: {
    flex: 1,
    maxWidth: 800,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 12,
  },
});
