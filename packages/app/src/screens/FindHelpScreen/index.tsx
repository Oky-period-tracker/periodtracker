import * as React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Screen } from "../../components/Screen";
import { data } from "../EncyclopediaScreen/data";
import { A } from "../../components/A";

function FindHelpScreen({ navigation }) {
  const helpCenters = data.helpCenters;

  return (
    <Screen>
      <ScrollView style={styles.scrollView}>
        {helpCenters.map((item) => (
          <View style={styles.helpCenterCard}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.caption}>{item.caption}</Text>

            <Text style={styles.subtitle}>Phone number:</Text>
            <Text style={styles.text}>{item.contactOne}</Text>

            <Text style={styles.subtitle}>Website:</Text>
            <A href={item.website} style={styles.website}>
              {item.website}
            </A>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

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
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  caption: {
    marginBottom: 8,
  },
  website: {
    //
  },
});
