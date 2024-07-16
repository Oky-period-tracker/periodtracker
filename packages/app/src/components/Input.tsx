import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ErrorText } from "./ErrorText";

export type InputProps = TextInputProps & {
  style?: ViewStyle;
  inputStyle?: TextInputProps["style"];
  errors?: string[]; // TODO:
  errorKey?: string; // TODO:
  errorsVisible?: boolean;
  displayOnly?: boolean;
  actionLeft?: React.ReactNode;
  actionRight?: React.ReactNode;
};

export const Input = ({
  value,
  placeholder,
  style,
  inputStyle,
  errors,
  errorKey,
  errorsVisible,
  placeholderTextColor = "#28b9cb",
  displayOnly = false,
  actionLeft,
  actionRight,
  ...props
}: InputProps) => {
  const ref = React.useRef<TextInput>(null);

  const onPress = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const hasError =
    errorsVisible && errorKey && errors && errors.includes(errorKey);

  return (
    <>
      {hasError && <ErrorText>{errorKey}</ErrorText>}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={[styles.container, props.multiline && styles.multiline, style]}
      >
        <View style={styles.wrapper}>
          <View style={styles.sideComponent}>{actionLeft}</View>
          {displayOnly ? (
            <Text
              style={[styles.input, !value && { color: placeholderTextColor }]}
            >
              {value || placeholder}
            </Text>
          ) : (
            <TextInput
              {...props}
              ref={ref}
              value={value}
              placeholder={placeholder}
              style={[styles.input, inputStyle]}
              placeholderTextColor={placeholderTextColor}
            />
          )}
          <View style={styles.sideComponent}>
            {actionRight}
            {hasError && (
              <FontAwesome size={16} name={"close"} color={"#E3629B"} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    textAlign: "center",
    // @ts-expect-error TODO
    outlineStyle: "none", // Web
  },
  sideComponent: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  multiline: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
