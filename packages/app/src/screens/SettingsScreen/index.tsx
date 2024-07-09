import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { Hr } from "../../components/Hr";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { TouchableRow, TouchableRowProps } from "../../components/TouchableRow";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Switch } from "../../components/Switch";
import { useDispatch } from "react-redux";
import { deleteAccountRequest, logoutRequest } from "../../redux/actions";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "../../redux/useSelector";
import { currentUserSelector } from "../../redux/selectors";

const SettingsScreen: ScreenComponent<"Settings"> = ({ navigation }) => {
  const currentUser = useSelector(currentUserSelector);
  const dispatch = useDispatch();
  const { setIsLoggedIn } = useAuth();

  const logOut = () => {
    dispatch(logoutRequest());
    setIsLoggedIn(false);
  };

  const deleteAccount = () => {
    if (!currentUser) {
      return;
    }
    dispatch(
      deleteAccountRequest({
        name: currentUser.name,
        password: currentUser.password,
        // setLoading,
      })
    );
  };

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
      description:
        "privacy_info",
      onPress: () => navigation.navigate("Privacy"),
      component: <ArrowRight />,
    },
    {
      title: "access_setting",
      description:
        "settings_info",
      onPress: () => navigation.navigate("Access"),
      component: <ArrowRight />,
    },
    {
      title: "future_prediciton",
      description: "future_prediciton_info",
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
        <Button onPress={logOut} status={"secondary"} style={styles.button}>
          log_out
        </Button>
        <Button
          onPress={deleteAccount}
          status={"basic"}
          style={[styles.button, styles.deleteButton]}
        >
          delete_account
        </Button>
        <Button
          status={"primary"}
          style={styles.button}
          onPress={() => navigation.navigate("Contact")}
        >
          contact_us
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
