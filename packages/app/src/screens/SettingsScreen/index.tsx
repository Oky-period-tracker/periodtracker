import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { Hr } from "../../components/Hr";

function SettingsScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("About")}
        >
          <View style={styles.segmentLeft}>
            <Text style={styles.title}>About</Text>
          </View>
          <View style={styles.segmentCenter}>
            <Text>Find out more about Oky</Text>
          </View>
        </TouchableOpacity>

        <Hr />

        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("Terms")}
        >
          <View style={styles.segmentLeft}>
            <Text style={styles.title}>Terms & Conditions</Text>
          </View>
          <View style={styles.segmentCenter}>
            <Text>What you agree by using Oky</Text>
          </View>
        </TouchableOpacity>

        <Hr />

        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("Privacy")}
        >
          <View style={styles.segmentLeft}>
            <Text style={styles.title}>Privacy Policy</Text>
          </View>
          <View style={styles.segmentCenter}>
            <Text>
              How Oky store, shares and protects the information you give
            </Text>
          </View>
        </TouchableOpacity>

        <Hr />

        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("Access")}
        >
          <View style={styles.segmentLeft}>
            <Text style={styles.title}>Access Settings </Text>
          </View>
          <View style={styles.segmentCenter}>
            <Text>
              Choose language, access a tutorial, or share Oky with a friend
            </Text>
          </View>
        </TouchableOpacity>

        <Hr />

        <TouchableOpacity style={styles.segment}>
          <View style={styles.segmentLeft}>
            <Text style={styles.title}>Future prediction</Text>
          </View>
          <View style={styles.segmentCenter}>
            <Text>Show future period days</Text>
          </View>
          <View style={styles.segmentRight}></View>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button status={"secondary"} style={styles.button}>
          Log out
        </Button>
        <Button status={"basic"} style={[styles.button, styles.deleteButton]}>
          Delete Account
        </Button>
        <Button
          status={"primary"}
          style={styles.button}
          onPress={() => navigation.navigate("Contact")}
        >
          Contact Us
        </Button>
      </View>
    </Screen>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    overflow: "hidden",
  },
  segment: {
    height: 100,
    width: "100%",
    flexDirection: "row",
  },
  segmentLeft: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    flexBasis: "30%",
  },
  segmentCenter: {
    justifyContent: "center",
    flex: 1,
    padding: 8,
  },
  segmentRight: {
    alignItems: "center",
    justifyContent: "center",
    flexBasis: "30%",
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%",
    maxWidth: 600,
    marginTop: 12,
  },
  button: {},
  deleteButton: {
    marginHorizontal: 8,
  },
});
