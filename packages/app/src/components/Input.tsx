import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ErrorText } from "./ErrorText";
import { useTranslate } from "../hooks/useTranslate";

export type InputProps = TextInputProps & {
  style?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps["style"];
  errors?: string[]; // TODO:
  errorKeys?: string[]; // TODO:
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
  errorKeys,
  errorsVisible,
  placeholderTextColor = "#28b9cb",
  displayOnly = false,
  actionLeft,
  actionRight,
  ...props
}: InputProps) => {
  const translate = useTranslate();
  const placeholderText = translate(placeholder || "");

  const ref = React.useRef<TextInput>(null);

  const onPress = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const activeErrorKeys = errorKeys?.reduce<string[]>((acc, errorKey) => {
    if (errors?.includes(errorKey)) {
      return [...acc, errorKey];
    }
    return acc;
  }, []);

  const errorKey = activeErrorKeys?.[0];
  const hasError = errorsVisible && errorKey;

  return (
    <>
      {hasError && <ErrorText>{errorKey}</ErrorText>}
      <TouchableOpacity
        onPress={onPress}
        disabled={displayOnly || !props.multiline}
        activeOpacity={1}
        style={[styles.container, props.multiline && styles.multiline, style]}
      >
        <View style={styles.wrapper}>
          <View style={styles.sideComponent}>{actionLeft}</View>
          {displayOnly ? (
            <Text
              style={[styles.input, !value && { color: placeholderTextColor }]}
              enableTranslate={false}
            >
              {value || placeholderText}
            </Text>
          ) : (
            <TextInput
              {...props}
              ref={ref}
              value={value}
              placeholder={placeholderText}
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
    zIndex: 99,
  },
  multiline: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
