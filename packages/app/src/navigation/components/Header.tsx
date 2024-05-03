import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export const Header = ({ navigation, options }: NativeStackHeaderProps) => {
  const currentRoutes = navigation.getState().routes;
  const showBackButton = currentRoutes.length > 1;

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {showBackButton ? (
          <Button onPress={navigation.goBack} style={styles.button}>
            <FontAwesome size={12} name={"arrow-left"} color={"#fff"} />
          </Button>
        ) : null}
        <Text style={styles.title}>{options.title}</Text>
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
    fontSize: 22,
    fontWeight: "400",
    marginLeft: "auto",
  },
});
