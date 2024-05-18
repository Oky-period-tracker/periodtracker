import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CustomStackNavigationOptions } from "../NavigationStack";

type HeaderProps = NativeStackHeaderProps & {
  options: CustomStackNavigationOptions;
};

export const Header = ({ navigation, route, options }: HeaderProps) => {
  // @ts-ignore @TODO: fixme
  const title = route.params?.title ?? options.title;
  const showBackButton = options.name !== options.initialRouteName;

  const onBackPress = () => {
    navigation.navigate(options.initialRouteName);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {showBackButton ? (
          <Button onPress={onBackPress} style={styles.button}>
            <FontAwesome size={12} name={"arrow-left"} color={"#fff"} />
          </Button>
        ) : null}
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
    backgroundColor: "transparent",
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
