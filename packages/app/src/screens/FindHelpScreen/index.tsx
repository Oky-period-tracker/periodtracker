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

  // TODO: use redux state
  const [savedHelpCenters, setSavedHelpCenters] = React.useState<number[]>([]);

  const sortedResults = React.useMemo(() => {
    return results.sort((a, b) => {
      const isASaved = savedHelpCenters.includes(a.id);
      const isBSaved = savedHelpCenters.includes(b.id);

      // Primary sorting by saved status
      if (isASaved && !isBSaved) {
        return -1;
      }
      if (!isASaved && isBSaved) {
        return 1;
      }

      // Secondary sorting by sortingKey
      const aSortingKey = a.sortingKey;
      const bSortingKey = b.sortingKey;

      return aSortingKey - bSortingKey;
    });
  }, [results, savedHelpCenters]);

  return (
    <Screen>
      <Input value={query} onChangeText={setQuery} placeholder={"search"} />
      <ScrollView style={styles.scrollView}>
        {sortedResults.map((item) => {
          const isSaved = savedHelpCenters.includes(item.id);
          const onSavePress = () => {
            setSavedHelpCenters((current) => {
              if (current.includes(item.id)) {
                return current.filter((h) => h !== item.id);
              }
              return [...current, item.id];
            });
          };

          return (
            <HelpCenterCard
              key={`help-center-${item.id}`}
              helpCenter={item}
              isSaved={isSaved}
              onSavePress={onSavePress}
            />
          );
        })}
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
