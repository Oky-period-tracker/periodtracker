import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SvgIconProps } from "./icons/types";

type IconButtonProps = SvgIconProps & {
  Icon: React.FC<SvgIconProps>;
  onPress?: () => void;
  text?: string;
};

export const IconButton = ({
  Icon,
  status,
  style,
  text,
  size = 80,
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: size, height: size }, style]}
    >
      <Icon status={status} style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  text: {
    width: "60%",
    textAlign: "center",
    marginRight: 8,
  },
});
