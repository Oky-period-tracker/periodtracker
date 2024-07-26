import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Accordion } from "./components/Accordion";
import { Screen } from "../../components/Screen";
import { HelpCard } from "./components/HelpCard";
import { CategoryPicker } from "./components/CategoryPicker";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { useEncyclopedia } from "./EncyclopediaContext";
import { SearchBar } from "../../components/SearchBar";

const EncyclopediaScreen: ScreenComponent<"Encyclopedia"> = ({
  navigation,
}) => {
  const { query, setQuery } = useEncyclopedia();
  const goToHelpScreen = () => navigation.navigate("Help");

  return (
    <Screen>
      <HelpCard onPress={goToHelpScreen} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar query={query} setQuery={setQuery} />
        <CategoryPicker />
        <Accordion />
      </ScrollView>
    </Screen>
  );
};

export default EncyclopediaScreen;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
  container: {
    alignItems: "center",
  },
  screen: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    height: 50,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    color: "black",
  },
});
