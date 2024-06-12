import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Button } from "../../../components/Button";
import { useAuthMode } from "../AuthModeContext";

export const AuthHeader = ({ title }: { title: string }) => {
  const { setAuthMode } = useAuthMode();
  const onClose = () => setAuthMode("start");

  return (
    <View style={styles.header}>
      <View style={styles.closeButton}>{/* Spacer */}</View>
      <Text style={styles.title}>{title}</Text>
      <Button
        onPress={onClose}
        style={styles.closeButton}
        status="danger_light"
      >
        <FontAwesome size={16} name={"close"} color={"#fff"} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 80,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E3629B",
    flexDirection: "row",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    width: 24,
    height: 24,
    margin: 24,
  },
});
