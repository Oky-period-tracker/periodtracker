import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

export const Button = ({
  style,
  children,
  title,
  ...props
}: TouchableOpacityProps & {
  title?: string;
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <View style={styles.highlight}></View>
      <View style={styles.shadow}></View>
      <View style={styles.body}>
        {children}
        {title ? <Text>{title}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bada55",
    height: 40,
    width: 120,
    borderRadius: 500,
    margin: 2,
  },
  highlight: {
    position: "absolute",
    top: -2,
    left: -2,
    width: "100%",
    height: "100%",
    borderRadius: 500,
    backgroundColor: "white",
  },
  shadow: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: "100%",
    height: "100%",
    borderRadius: 500,
    backgroundColor: "#8ba13d",
  },
  body: {
    paddingRight: 2,
    margin: "auto",
    width: "100%",
    height: "100%",
    borderRadius: 500,
    backgroundColor: "#bada55",
    justifyContent: "center",
    alignItems: "center",
  },
});
