import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";
import AnimatedContainer from "../../components/AnimatedContainer";
import { SignUp } from "./components/SignUp";
import { AuthToggle } from "./components/AuthToggle";
import { AuthModeProvider, useAuthMode } from "./AuthModeContext";
import { ScreenProps } from "../../navigation/RootNavigator";
import AvatarAndThemeScreen from "../AvatarAndThemeScreen";
import { Welcome } from "./components/Welcome";
import { Journey } from "./components/Journey";
import { AuthLinks } from "./components/AuthLinks";
import { LogIn } from "./components/LogIn";
import { DeleteAccount } from "./components/DeleteAccount";
import { ForgotPassword } from "./components/ForgotPassword";

const AuthScreen = (props: ScreenProps<"Auth">) => {
  return (
    <AuthModeProvider>
      <AuthScreenInner {...props} />
    </AuthModeProvider>
  );
};

const AuthScreenInner = ({ navigation }: ScreenProps<"Auth">) => {
  const { authMode, setAuthMode } = useAuthMode();
  const goToInfo = () => navigation.navigate("Info");

  if (authMode === "avatar_and_theme") {
    const onConfirm = () => setAuthMode("onboard_journey");
    return <AvatarAndThemeScreen onConfirm={onConfirm} />;
  }

  return (
    <Screen>
      <AnimatedContainer style={styles.container}>
        {authMode === "start" && <AuthToggle />}
        {authMode === "log_in" && <LogIn />}
        {authMode === "sign_up" && <SignUp />}
        {authMode === "forgot_password" && <ForgotPassword />}
        {authMode === "delete_account" && <DeleteAccount />}
      </AnimatedContainer>

      {authMode === "welcome" && <Welcome />}
      {authMode === "onboard_journey" && <Journey />}

      {authMode === "start" && (
        <>
          <AuthLinks />
          <View style={styles.footer}>
            <Button status={"basic"} onPress={goToInfo}>
              Info
            </Button>
            <Button status={"basic"}>English</Button>
          </View>
        </>
      )}
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
