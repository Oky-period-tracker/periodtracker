import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { Hr } from "../../components/Hr";

function SettingsScreen({ navigation }) {
  const settingsOptions: SettingsSegmentProps[] = [
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
        {settingsOptions.map((props, i) => (
          <>
            <SettingsSegment key={`settings-${i}`} {...props} />
            {i !== settingsOptions.length - 1 ? <Hr /> : null}
          </>
        ))}
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

type SettingsSegmentProps = {
  title: string;
  description: string;
  onPress?: () => void;
  component?: React.ReactNode;
};

const SettingsSegment = ({
  title,
  description,
  onPress,
  component = null,
}: SettingsSegmentProps) => {
  return (
    <TouchableOpacity style={styles.segment} onPress={onPress}>
      <View style={styles.segmentLeft}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.segmentCenter}>
        <Text>{description}</Text>
      </View>
      {component && <View style={styles.segmentRight}>{component}</View>}
    </TouchableOpacity>
  );
};

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
