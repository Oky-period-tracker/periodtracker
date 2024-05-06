import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { data } from "../EncyclopediaScreen/data";
import { InfoDisplay } from "../../components/InfoDisplay";

function PrivacyScreen({ navigation }) {
  const content = data.privacyPolicy;

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

export default PrivacyScreen;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
});
