import { StyleSheet, View } from "react-native";

export const DailyCard = () => {
  return <View style={[styles.inner, { aspectRatio: aspectRatio }]}></View>;
};

const aspectRatio = 1.5;

const styles = StyleSheet.create({
  inner: {
    borderRadius: 20,
    width: "100%",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
});
