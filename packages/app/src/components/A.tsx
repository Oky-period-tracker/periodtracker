import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import * as Linking from "expo-linking";

export const A = ({
  href,
  style,
  ...props
}: TouchableOpacityProps & {
  href: string;
}) => {
  const onPressLink = () => openURL(href);

  const children = props.children ? (
    typeof props.children === "string" ? (
      <Text style={styles.text}>{props.children}</Text>
    ) : (
      props.children
    )
  ) : null;

  return (
    <TouchableOpacity style={style} onPress={onPressLink}>
      {children}
    </TouchableOpacity>
  );
};

const openURL = (href, target = "_blank") => {
  let url = href;
  if (!url.includes("https://")) {
    url = `https://${url}`;
  }

  if (Platform.OS === "web") {
    window.open(url, target);
    return;
  }

  Linking.openURL(url);
};

const styles = StyleSheet.create({
  text: {
    color: "#0000EE",
  },
});
