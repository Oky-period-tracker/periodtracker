import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type TouchableRowProps = {
  title: string;
  description: string;
  onPress?: () => void;
  component?: React.ReactNode;
};

export const TouchableRow = ({
  title,
  description,
  onPress,
  component = null,
}: TouchableRowProps) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rowCenter}>
        <Text>{description}</Text>
      </View>
      {component && <View style={styles.rowRight}>{component}</View>}
    </TouchableOpacity>
  );
};

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
  },
  rowLeft: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    flexBasis: "30%",
  },
  rowCenter: {
    justifyContent: "center",
    flex: 1,
    padding: 8,
  },
  rowRight: {
    alignItems: "center",
    justifyContent: "center",
    flexBasis: "30%",
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%",
    maxWidth: 600,
    marginTop: 12,
  },
  button: {},
  deleteButton: {
    marginHorizontal: 8,
  },
});
