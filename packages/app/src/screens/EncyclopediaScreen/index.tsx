import * as React from "react";
import { View,StyleSheet, ScrollView } from "react-native";
import { Accordion } from "./components/Accordion";
import { Screen } from "../../components/Screen";
import { HelpCard } from "./components/HelpCard";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Input } from "../../components/Input";
import { useEncyclopedia } from "./EncyclopediaContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const EncyclopediaScreen: ScreenComponent<"Encyclopedia"> = ({
  navigation,
}) => {
  const goToHelpScreen = () => navigation.navigate("Help");

  const { query, setQuery } = useEncyclopedia();

  return (
    <Screen>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}>
      <HelpCard onPress={goToHelpScreen} />
      <View style={styles.searchContainer}>
        <Input value={query} onChangeText={setQuery} style={styles.input} placeholder={"Search"} />
        {query.length > 0 && ( // Render X button only when there's text in the input
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={24} color="grey" />
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingTop: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    color: 'black',
  },
  closeButton: {
    padding: 10,
    marginRight: 5,
  },
});
