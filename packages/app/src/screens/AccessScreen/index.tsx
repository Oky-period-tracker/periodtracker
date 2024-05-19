import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Screen } from "../../components/Screen";
import { Hr } from "../../components/Hr";
import { AccessRow, AccessRowProps } from "./components/AccessRow";
import { ScreenComponent } from "../../navigation/RootNavigator";

const AccessScreen: ScreenComponent<"Access"> = () => {
  const rows: AccessRowProps[] = [
    {
      title: "Language",
      description: "Change the language Oky uses",
      buttonText: "English",
    },
    {
      title: "Tutorial",
      description: "Get instructions on how to use Oky",
      buttonText: "Launch",
    },
    {
      title: "Share",
      description: "Share Oky with your friends",
      buttonText: "Share",
    },
  ];

  return (
    <Screen>
      <View style={styles.container}>
        {rows.map((props, i) => {
          const isLast = i !== rows.length - 1;
          return (
            <>
              <AccessRow key={`access-${i}`} {...props} />
              {isLast ? <Hr /> : null}
            </>
          );
        })}
      </View>
    </Screen>
  );
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
