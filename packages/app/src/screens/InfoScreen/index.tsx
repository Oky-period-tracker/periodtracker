import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Screen } from "../../components/Screen";
import { TouchableRow, TouchableRowProps } from "../../components/TouchableRow";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Hr } from "../../components/Hr";

const InfoScreen = ({ navigation }) => {
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
      title: "Encyclopedia",
      description: "",
      onPress: () => navigation.navigate("Encyclopedia"),
      component: <ArrowRight />,
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
    </Screen>
  );
};

export default InfoScreen;

const ArrowRight = () => (
  <FontAwesome size={12} name={"arrow-right"} color={"#D1D0D2"} />
);

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
