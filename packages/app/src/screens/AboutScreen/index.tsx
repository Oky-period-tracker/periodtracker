import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { data } from "../EncyclopediaScreen/data";
import { InfoDisplay } from "../../components/InfoDisplay";
import { Screen } from "../../components/Screen";

function AboutScreen({ navigation }) {
  const content = data.about;

  return (
    <Screen>
      <ScrollView style={styles.scrollView}>
        <InfoDisplay content={content} />
      </ScrollView>
    </Screen>
  );
}

export default AboutScreen;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
});
