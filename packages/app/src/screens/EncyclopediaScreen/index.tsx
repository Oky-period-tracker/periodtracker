import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Accordion } from "./components/Accordion";
import { Screen } from "../../components/Screen";
import { HelpCard } from "./components/HelpCard";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Input } from "../../components/Input";
import { useEncyclopedia } from "./EncyclopediaContext";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "../../components/Button";

const EncyclopediaScreen: ScreenComponent<"Encyclopedia"> = ({
  navigation,
}) => {
  const goToHelpScreen = () => navigation.navigate("Help");

  const { query, setQuery } = useEncyclopedia();

  return (
    <Screen>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <HelpCard onPress={goToHelpScreen} />
        <View style={styles.searchContainer}>
          <Input
            value={query}
            onChangeText={setQuery}
            style={styles.input}
            placeholder={"Search"}
          />
          {query.length > 0 && (
            <Button
              style={styles.closeButton}
              status="basic"
              onPress={() => setQuery("")}
            >
              <FontAwesome name="close" size={20} color="grey" />
            </Button>
          )}
        </View>
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
    paddingHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingTop: 8,
    paddingVertical: 8,
    backgroundColor: "#fff",
    color: "black",
  },
  closeButton: {
    width: 30,
    height: 30,
  },
});
