import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from "react-native";

type ButtonStatus = "primary" | "secondary" | "basic" | "danger";

export type ButtonProps = ViewProps & {
  onPress?: () => void;
  status?: ButtonStatus;
};

export const Button = ({
  style,
  onPress,
  status = "primary",
  ...props
}: ButtonProps) => {
  const colors = palette[status];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.base }, style]}
      onPress={onPress}
      {...props}
    >
      <ButtonInner status={status} {...props} />
    </TouchableOpacity>
  );
};

export const DisplayButton = ({
  style,
  status = "primary",
  ...props
}: ButtonProps) => {
  const colors = palette[status];

  return (
    <View
      style={[styles.container, { backgroundColor: colors.base }, style]}
      {...props}
    >
      <ButtonInner status={status} {...props} />
    </View>
  );
};

const ButtonInner = ({ status, ...props }: ButtonProps) => {
  const colors = palette[status];

  const children = props.children ? (
    typeof props.children === "string" ? (
      <Text style={styles.text}>{props.children}</Text>
    ) : (
      props.children
    )
  ) : null;

  return (
    <>
      <View
        style={[styles.highlight, { backgroundColor: colors.highlight }]}
      ></View>
      <View style={[styles.shadow, { backgroundColor: colors.shadow }]}></View>
      <View style={[styles.body, { backgroundColor: colors.base }]}>
        {children}
      </View>
    </>
  );
};

const palette: Record<
  ButtonStatus,
  { base: string; highlight: string; shadow: string }
> = {
  primary: {
    base: "#97C800",
    highlight: "#fff",
    shadow: "#00A65A",
  },
  secondary: {
    base: "#FF8C00",
    highlight: "#FFC26A",
    shadow: "#BD6600",
  },
  basic: {
    base: "#D1D0D2",
    highlight: "#fff",
    shadow: "#B7B6B6",
  },
  danger: {
    base: "#E3629B",
    highlight: "#F9C7C1",
    shadow: "#971B63",
  },
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 100,
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
  text: {
    textAlign: "center",
  },
});
