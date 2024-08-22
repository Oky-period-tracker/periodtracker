import * as React from "react";
import { View, StyleSheet, Share } from "react-native";
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
import { useTranslate } from "../../hooks/useTranslate";
import { globalStyles } from "../../config/theme";

const AccessScreen: ScreenComponent<"Access"> = ({ navigation }) => {
  const { setLoading } = useLoading();

  const launchTutorial = () => {
    setLoading(true);
    navigation.navigate("Home", { tutorial: "tutorial_two" });
  };

  const rows: TouchableRowProps[] = [
    {
      title: "language",
      description: "language_subtitle",
      component: <LanguageSelector />,
    },
    {
      title: "tutorial",
      description: "tutorial_subtitle",
      component: <LaunchButton onPress={launchTutorial} />,
    },
    {
      title: "share_setting",
      description: "share_qr_description",
      component: <ShareButton />,
    },
  ];

  return (
    <Screen>
      <View style={[styles.container, globalStyles.shadow]}>
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
  return <Button {...props}>launch</Button>;
};

const ShareButton = () => {
  const dispatch = useDispatch();
  const translate = useTranslate();

  const shareLink = () => {
    const message = translate("join_oky_message");
    const title = message;

    const shareOptions = {
      title,
      message,
      url: WEBSITE_URL,
    };

    Share.share(shareOptions);
    dispatch(shareApp());
  };

  return <Button onPress={shareLink}>share</Button>;
};

export default AccessScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
  },
});
