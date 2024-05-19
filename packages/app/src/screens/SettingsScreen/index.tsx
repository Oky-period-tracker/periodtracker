import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { Hr } from "../../components/Hr";
import { TouchableRow, TouchableRowProps } from "../../components/TouchableRow";

function SettingsScreen({ navigation }) {
  const rows: TouchableRowProps[] = [
    {
      title: "About",
      description: "Find out more about Oky",
      onPress: () => navigation.navigate("About"),
    },
    {
      title: "Terms & Conditions",
      description: "What you agree by using Oky",
      onPress: () => navigation.navigate("Terms"),
    },
    {
      title: "Privacy Policy",
      description:
        "How Oky stores, shares and protects the information you give",
      onPress: () => navigation.navigate("Privacy"),
    },
    {
      title: "Access Settings",
      description:
        "Choose language, access a tutorial, or share Oky with a friend",
      onPress: () => navigation.navigate("Access"),
    },
    {
      title: "Future prediction",
      description: "Show future period days",
      component: null, // TODO:
    },
  ];

  return (
    <Screen>
      <View style={styles.container}>
        {rows.map((props, i) => {
          const isLast = i !== rows.length - 1;
          return (
            <>
              <TouchableRow key={`settings-${i}`} {...props} />
              {isLast ? <Hr /> : null}
            </>
          );
        })}
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
