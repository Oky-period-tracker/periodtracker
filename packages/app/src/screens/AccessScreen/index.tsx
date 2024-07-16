import * as React from "react";
import * as Sharing from "expo-sharing";
import { View, StyleSheet } from "react-native";
import { Screen } from "../../components/Screen";
import { Hr } from "../../components/Hr";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { TouchableRow, TouchableRowProps } from "../../components/TouchableRow";
import { Button, ButtonProps } from "../../components/Button";
import { LanguageSelector } from "../../components/LanguageSelector";
import { shareApp } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { WEBSITE_URL } from "../../config/env";
import { useLoading } from "../../contexts/LoadingProvider";

const AccessScreen: ScreenComponent<"Access"> = ({ navigation }) => {
  const { setLoading } = useLoading();

  const launchTutorial = () => {
    setLoading(true);
    navigation.navigate("Home", { tutorial: "tutorial_two" });
  };

  const rows: TouchableRowProps[] = [
    {
      title: "Language",
      description: "Change the language Oky uses",
      component: <LanguageSelector />,
    },
    {
      title: "Tutorial",
      description: "Get instructions on how to use Oky",
      component: <LaunchButton onPress={launchTutorial} />,
    },
    {
      title: "Share",
      description: "Share Oky with your friends",
      component: <ShareButton />,
    },
  ];

  return (
    <Screen>
      <View style={styles.container}>
        {rows.map((props, i) => {
          const isLast = i === rows.length - 1;
          return (
            <React.Fragment key={`access-${i}`}>
              <TouchableRow {...props} />
              {!isLast && <Hr />}
            </React.Fragment>
          );
        })}
      </View>
    </Screen>
  );
};

const LaunchButton = (props: ButtonProps) => {
  return <Button {...props}>Launch</Button>;
};

const ShareButton = () => {
  const dispatch = useDispatch();

  const shareLink = () => {
    if (!Sharing.isAvailableAsync()) {
      return;
    }

    dispatch(shareApp());

    Sharing.shareAsync(WEBSITE_URL, {
      dialogTitle: "join_oky_message",
      // translate('join_oky_message'), // TODO:
    });
  };

  return <Button onPress={shareLink}>Share</Button>;
};

export default AccessScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    overflow: "hidden",
  },
});
