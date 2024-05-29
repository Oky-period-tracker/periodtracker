import * as React from "react";
import { StyleSheet } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";

const AuthScreen = ({ navigation, route }) => {
  const goToInfo = () => navigation.navigate("Info");

  return (
    <Screen style={styles.default}>
      <Button status={"basic"} onPress={goToInfo}>
        Info
      </Button>
      <Button status={"basic"}>English</Button>
    </Screen>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  default: {
    //
  },
});
