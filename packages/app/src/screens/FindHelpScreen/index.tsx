import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Screen } from "../../components/Screen";
import { HelpCenter, data } from "../../data/data";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { HelpCenterCard } from "./components/HelpCenterCard";
import { Input } from "../../components/Input";
import { useSearch } from "../../hooks/useSearch";

const FindHelpScreen: ScreenComponent<"Help"> = () => {
  const { query, setQuery, results } = useSearch<HelpCenter>({
    options: helpCenters,
    keys: searchKeys,
  });

  return (
    <Screen>
      <ScrollView style={styles.scrollView}>
        <Input value={query} onChangeText={setQuery} placeholder={"search"} />
        {results.map((item) => (
          <HelpCenterCard key={`help-center-${item.id}`} helpCenter={item} />
        ))}
      </ScrollView>
    </Screen>
  );
};

// TODO: get help centers from redux
const helpCenters = data.helpCenters;

const searchKeys = [
  "title" as const,
  "caption" as const,
  "address" as const,
  "websites" as const,
  // TODO: Add string of combined attribute names to HelpCenter type for use here in search
];

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
