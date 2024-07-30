import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Screen } from "../../components/Screen";
import { TouchableRow, TouchableRowProps } from "../../components/TouchableRow";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Hr } from "../../components/Hr";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { globalStyles } from "../../config/theme";

const InfoScreen: ScreenComponent<"Info"> = ({ navigation }) => {
  const rows: TouchableRowProps[] = [
    {
      title: "about",
      description: "about_info",
      onPress: () => navigation.navigate("About"),
      component: <ArrowRight />,
    },
    {
      title: "t_and_c",
      description: "t_and_c_info",
      onPress: () => navigation.navigate("Terms"),
      component: <ArrowRight />,
    },
    {
      title: "privacy_policy",
      description: "privacy_info",
      onPress: () => navigation.navigate("Privacy"),
      component: <ArrowRight />,
    },
    {
      title: "encyclopedia",
      description: "",
      onPress: () => navigation.navigate("Encyclopedia"),
      component: <ArrowRight />,
    },
  ];

  return (
    <Screen>
      <View style={[styles.container, globalStyles.shadow]}>
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
