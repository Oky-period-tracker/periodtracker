import * as React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Screen } from "../../components/Screen";
import { HelpCenter, data } from "../../data/data";
import { A } from "../../components/A";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { HelpCenterCard } from "./components/HelpCenterCard";

const FindHelpScreen: ScreenComponent<"Help"> = () => {
  const helpCenters = data.helpCenters;

  return (
    <Screen>
      <ScrollView style={styles.scrollView}>
        {helpCenters.map((item) => (
          <HelpCenterCard key={`help-center-${item.id}`} helpCenter={item} />
        ))}
      </ScrollView>
    </Screen>
  );
};

export default FindHelpScreen;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
  helpCenterCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    marginVertical: 4,
    padding: 24,
  },
  text: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  caption: {
    marginBottom: 8,
  },
  website: {
    marginBottom: 8,
  },
});
