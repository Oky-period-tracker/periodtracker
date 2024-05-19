import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Screen } from "../../components/Screen";
import { DisplayButton } from "../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScreenComponent } from "../../navigation/RootNavigator";

const AvatarAndThemeScreen: ScreenComponent<"AvatarAndTheme"> = () => {
  return (
    <Screen style={styles.screen}>
      <View style={styles.avatars}>
        <View style={styles.avatar}>
          <DisplayButton style={styles.check}>
            <FontAwesome size={12} name={"check"} color={"#fff"} />
          </DisplayButton>
        </View>
        <View style={styles.avatar}></View>
        <View style={styles.avatar}></View>
        <View style={styles.avatar}></View>
        <View style={styles.avatar}></View>
        <View style={styles.avatar}></View>
        <View style={styles.avatar}></View>
      </View>

      <View style={styles.themes}>
        <View style={styles.theme}></View>
        <View style={styles.theme}></View>
        <View style={styles.theme}></View>
        <View style={styles.theme}></View>
      </View>
    </Screen>
  );
};

export default AvatarAndThemeScreen;

const styles = StyleSheet.create({
  screen: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  avatars: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: "white",
    width: 100,
    height: 100,
    borderRadius: 20,
    margin: 4,
  },
  themes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexWrap: "wrap",
  },
  theme: {
    backgroundColor: "white",
    minWidth: 100,
    height: 100,
    borderRadius: 20,
    flexBasis: "40%",
    margin: 8,
  },
  check: {
    height: 24,
    width: 24,
    position: "absolute",
    top: 8,
    left: 8,
  },
});
