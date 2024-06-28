import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { InfoDisplay } from "../../components/InfoDisplay";
import { Screen } from "../../components/Screen";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { useSelector } from "../../redux/useSelector";
import { privacyContent } from "../../redux/selectors";

const PrivacyScreen: ScreenComponent<"Privacy"> = () => {
  const content = useSelector(privacyContent);

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
