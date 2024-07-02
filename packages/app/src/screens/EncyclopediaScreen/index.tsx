import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Accordion } from "./components/Accordion";
import { Screen } from "../../components/Screen";
import { HelpCard } from "./components/HelpCard";
import { CategoryPicker } from "./components/CategoryPicker";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Input } from "../../components/Input";
import { useEncyclopedia } from "./EncyclopediaContext";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "../../components/Button";

const EncyclopediaScreen: ScreenComponent<"Encyclopedia"> = ({
  navigation,
}) => {
  const { query, setQuery } = useEncyclopedia();
  const goToHelpScreen = () => navigation.navigate("Help");

  return (
    <Screen>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
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
              <FontAwesome name="close" size={20} color="white" />
            </Button>
          )}
        </View>
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
  closeButton: {
    marginBottom: 12,
    width: 30,
    height: 30,
  },
});
