import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Accordion } from "./components/Accordion";
import { Screen } from "../../components/Screen";
import { HelpCard } from "./components/HelpCard";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Input } from "../../components/Input";
import { useEncyclopedia } from "./EncyclopediaContext";

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
        {/* TODO: add X button to clear query state */}
        <Input value={query} onChangeText={setQuery} placeholder={"search"} />
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
});
