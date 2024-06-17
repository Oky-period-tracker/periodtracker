import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { data } from "../../data/data";
import { InfoDisplay } from "../../components/InfoDisplay";
import { Screen } from "../../components/Screen";
import { ScreenComponent } from "../../navigation/RootNavigator";

const PrivacyScreen: ScreenComponent<"Privacy"> = () => {
  const content = data.privacyPolicy;

  return (
    <Screen>
      <ScrollView style={styles.scrollView}>
        <InfoDisplay content={content} />
      </ScrollView>
    </Screen>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
});
