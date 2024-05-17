import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";

function AccessScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("About")}
        >
          <View style={styles.segmentLeft}>
            <Text style={styles.title}>Language</Text>
            <Text>Change the language Oky uses:</Text>
          </View>
          <View style={styles.segmentRight}>
            <Button>English</Button>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("Terms")}
        >
          <View style={styles.segmentLeft}>
            <Text style={styles.title}>Tutorial</Text>
            <Text>Get instructions on how to use Oky</Text>
          </View>
          <View style={styles.segmentRight}></View>
          <View style={styles.segmentRight}>
            <Button>Launch</Button>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("Privacy")}
        >
          <View style={styles.segmentLeft}>
            <Text style={styles.title}>Share</Text>
            <Text>Share Oky with your friends</Text>
          </View>
          <View style={styles.segmentRight}>
            <Button>Share</Button>
          </View>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

export default AccessScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    width: "100%",
    overflow: "hidden",
  },
  segment: {
    height: 100,
    width: "100%",
    borderBottomWidth: 1,
    flexDirection: "row",
    padding: 24,
  },
  segmentLeft: {
    flexBasis: "30%",
    justifyContent: "center",
  },
  segmentRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
});
