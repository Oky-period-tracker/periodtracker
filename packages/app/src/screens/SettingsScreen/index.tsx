import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";

function SettingsScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("AboutScreen")}
        >
          <View style={styles.segmentLeft}>
            <Text style={styles.title}>About</Text>
          </View>
          <View style={styles.segmentCenter}>
            <Text>Find out more about Oky</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("TermsScreen")}
        >
          <View style={styles.segmentLeft}>
            <Text style={styles.title}>Terms & Conditions</Text>
          </View>
          <View style={styles.segmentCenter}>
            <Text>What you agree by using Oky</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("PrivacyScreen")}
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

        <TouchableOpacity
          style={styles.segment}
          onPress={() => navigation.navigate("AccessScreen")}
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
        <Button status={"secondary"}>Log out</Button>
        <Button status={"basic"} style={styles.deleteButton}>
          Delete Account
        </Button>
        <Button
          status={"primary"}
          onPress={() => navigation.navigate("ContactUsScreen")}
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
    borderWidth: 1,
    width: "100%",
    overflow: "hidden",
  },
  segment: {
    height: 100,
    width: "100%",
    backgroundColor: "red",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  segmentLeft: {
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    flexBasis: "30%",
  },
  segmentCenter: {
    backgroundColor: "blue",
    justifyContent: "center",
    flex: 1,
    padding: 8,
  },
  segmentRight: {
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
    flexBasis: "30%",
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
  deleteButton: {
    marginHorizontal: 8,
  },
});
