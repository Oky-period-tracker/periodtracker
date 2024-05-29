import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CustomStackNavigationOptions } from "./NavigationStack";
import { IS_ANDROID } from "../../services/device";

type HeaderProps = NativeStackHeaderProps & {
  options: CustomStackNavigationOptions;
};

export const Header = ({ navigation, options }: HeaderProps) => {
  const title = options.title;
  const showBackButton = options.name !== options.initialRouteName;

  const onBackPress = () => {
    navigation.navigate(options.initialRouteName);
  };

  return (
    <SafeAreaView style={styles.container}>
      {showBackButton ? (
        <Button onPress={onBackPress} style={styles.button}>
          <FontAwesome size={12} name={"arrow-left"} color={"#fff"} />
        </Button>
      ) : null}
      <Text style={styles.title}>{title}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 80,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: IS_ANDROID ? 20 : 0,
  },
  button: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: "auto",
    color: "#F49200",
  },
});
