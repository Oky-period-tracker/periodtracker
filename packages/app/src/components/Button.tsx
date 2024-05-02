import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
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
    <TouchableOpacity style={[styles.default, style]} {...props}>
      {children}
      {title ? <Text>{title}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  default: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#bada55",
    borderRadius: 50,
  },
});
