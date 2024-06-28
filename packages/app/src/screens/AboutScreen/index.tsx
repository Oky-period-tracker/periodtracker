import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { InfoDisplay } from "../../components/InfoDisplay";
import { Screen } from "../../components/Screen";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { useSelector } from "../../redux/useSelector";
import { aboutContent } from "../../redux/selectors";

const AboutScreen: ScreenComponent<"About"> = () => {
  const content = useSelector(aboutContent);
  // const aboutBanner = useSelector(selectors.aboutBanner) // TODO:

  return (
    <Screen>
      <ScrollView style={styles.scrollView}>
        <InfoDisplay content={content} />
      </ScrollView>
    </Screen>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
});
