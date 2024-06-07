import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";
import AnimatedContainer from "../../components/AnimatedContainer";
import { SignUp } from "./components/SignUp";
import { AuthToggle } from "./components/AuthToggle";
import { AuthModeProvider, useAuthMode } from "./AuthModeContext";

const AuthScreen = (props) => {
  return (
    <AuthModeProvider>
      <AuthScreenInner {...props} />
    </AuthModeProvider>
  );
};

const AuthScreenInner = ({ navigation }) => {
  const { authMode } = useAuthMode();
  const goToInfo = () => navigation.navigate("Info");

  return (
    <Screen>
      <AnimatedContainer style={styles.container}>
        {authMode === "start" && <AuthToggle />}
        {authMode === "sign_up" && <SignUp />}
      </AnimatedContainer>

      <View style={styles.footer}>
        <Button status={"basic"} onPress={goToInfo}>
          Info
        </Button>
        <Button status={"basic"}>English</Button>
      </View>
    </Screen>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    overflow: "hidden",
    height: 200,
    zIndex: 999,
  },
  footer: {
    marginTop: "auto",
    marginBottom: 24,
    marginHorizontal: 24,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
