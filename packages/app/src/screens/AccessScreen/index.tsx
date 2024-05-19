import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { Hr } from "../../components/Hr";

export type AccessRowProps = {
  title: string;
  description: string;
  buttonText: string;
  onPress?: () => void;
};

export const AccessRow = ({
  title,
  description,
  buttonText,
  onPress,
}: AccessRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.title}>{title}</Text>
        <Text>{description}</Text>
      </View>
      <View style={styles.rowRight}>
        <Button onPress={onPress}>{buttonText}</Button>
      </View>
    </View>
  );
};

function AccessScreen({ navigation }) {
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
}

export default AccessScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    overflow: "hidden",
  },
  row: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    padding: 24,
  },
  rowLeft: {
    flexBasis: "30%",
    justifyContent: "center",
    flex: 1,
    padding: 8,
  },
  rowRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
});
