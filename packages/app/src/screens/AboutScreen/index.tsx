import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { data } from "../EncyclopediaScreen/data";
import { InfoDisplay } from "../../components/InfoDisplay";

function AboutScreen({ navigation }) {
  const content = data.about;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "red",
        padding: 12,
      }}
    >
      <ScrollView style={styles.scrollView}>
        <InfoDisplay content={content} />
      </ScrollView>
    </View>
  );
}

export default AboutScreen;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
});
