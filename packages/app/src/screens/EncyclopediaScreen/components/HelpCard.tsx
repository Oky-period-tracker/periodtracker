import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export const HelpCard = ({ style, ...props }: TouchableOpacityProps) => {
  return (
    <TouchableOpacity style={styles.helpCard} {...props}>
      <Text>Find Help</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  helpCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 200,
    height: 100,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
