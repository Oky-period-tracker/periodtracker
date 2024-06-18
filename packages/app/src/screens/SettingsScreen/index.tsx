import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { Hr } from "../../components/Hr";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { TouchableRow, TouchableRowProps } from "../../components/TouchableRow";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Switch } from "../../components/Switch";

const SettingsScreen: ScreenComponent<"Settings"> = ({ navigation }) => {
  const rows: TouchableRowProps[] = [
    {
      title: "About",
      description: "Find out more about Oky",
      onPress: () => navigation.navigate("About"),
      component: <ArrowRight />,
    },
    {
      title: "Terms & Conditions",
      description: "What you agree by using Oky",
      onPress: () => navigation.navigate("Terms"),
      component: <ArrowRight />,
    },
    {
      title: "Privacy Policy",
      description:
        "How Oky stores, shares and protects the information you give",
      onPress: () => navigation.navigate("Privacy"),
      component: <ArrowRight />,
    },
    {
      title: "Access Settings",
      description:
        "Choose language, access a tutorial, or share Oky with a friend",
      onPress: () => navigation.navigate("Access"),
      component: <ArrowRight />,
    },
    {
      title: "Future prediction",
      description: "Show future period days",
      component: <PredictionControls />,
      disabled: true,
    },
  ];

  return (
    <Screen>
      <View style={styles.container}>
        {rows.map((props, i) => {
          const isLast = i === rows.length - 1;
          return (
            <React.Fragment key={`settings-${i}`}>
              <TouchableRow {...props} />
              {!isLast && <Hr />}
            </React.Fragment>
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
};

export default SettingsScreen;

const ArrowRight = () => (
  <FontAwesome size={12} name={"arrow-right"} color={"#D1D0D2"} />
);

const PredictionControls = () => {
  return <Switch />;
};

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
