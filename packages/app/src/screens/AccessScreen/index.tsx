import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Screen } from "../../components/Screen";
import { Hr } from "../../components/Hr";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { TouchableRow, TouchableRowProps } from "../../components/TouchableRow";
import { Button } from "../../components/Button";

const AccessScreen: ScreenComponent<"Access"> = () => {
  const rows: TouchableRowProps[] = [
    {
      title: "Language",
      description: "Change the language Oky uses",
      component: <LanguageButton />,
    },
    {
      title: "Tutorial",
      description: "Get instructions on how to use Oky",
      component: <LaunchButton />,
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
          const isLast = i !== rows.length - 1;
          return (
            <React.Fragment key={`access-${i}`}>
              <TouchableRow {...props} />
              {isLast ? <Hr /> : null}
            </React.Fragment>
          );
        })}
      </View>
    </Screen>
  );
};

const LanguageButton = () => {
  return <Button>English</Button>;
};

const LaunchButton = () => {
  return <Button>Launch</Button>;
};

const ShareButton = () => {
  return <Button>Share</Button>;
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
