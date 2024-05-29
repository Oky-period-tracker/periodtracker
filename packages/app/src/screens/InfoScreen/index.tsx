import * as React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { data } from "../EncyclopediaScreen/data";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";

const InfoScreen = ({ navigation, route }) => {
  const goToEncyclopedia = () => navigation.navigate("encyclopedia");

  return (
    <Screen style={styles.default}>
      <Button status={"basic"} onPress={goToEncyclopedia}>
        Encyclopedia
      </Button>
    </Screen>
  );
};

export default InfoScreen;

const styles = StyleSheet.create({
  //
  default: {
    //
  },
});
