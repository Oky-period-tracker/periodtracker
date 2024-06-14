import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ErrorText } from "./ErrorText";
import { Button } from "./Button";

export type InputProps = TextInputProps & {
  style?: ViewStyle;
  inputStyle?: TextInputProps["style"];
  info?: string;
  errors?: string[]; // TODO:
  errorKey?: string; // TODO:
  errorsVisible?: boolean;
  displayOnly?: boolean;
};

export const Input = ({
  value,
  placeholder,
  style,
  inputStyle,
  info,
  errors,
  errorKey,
  errorsVisible,
  placeholderTextColor = "#28b9cb",
  displayOnly = false,
  ...props
}: InputProps) => {
  const hasError = errorsVisible && errorKey && errors.includes(errorKey);

  return (
    <>
      {hasError && <ErrorText>{errorKey}</ErrorText>}
      <View
        style={[styles.container, props.multiline && styles.multiline, style]}
      >
        <View style={[styles.wrapper]}>
          {info ? (
            <Button
              status={"danger_light"}
              style={styles.sideComponent}
              //   onPress={onYesPress} // TODO:
            >
              <FontAwesome size={12} name={"info"} color={"#fff"} />
            </Button>
          ) : (
            <View style={styles.sideComponent}>{/* Spacer */}</View>
          )}
          {displayOnly ? (
            <Text
              style={[styles.input, !value && { color: placeholderTextColor }]}
            >
              {value || placeholder}
            </Text>
          ) : (
            <TextInput
              {...props}
              value={value}
              placeholder={placeholder}
              style={[styles.input, inputStyle]}
              placeholderTextColor={placeholderTextColor}
            />
          )}
          <View style={styles.sideComponent}>
            {hasError && (
              <FontAwesome size={16} name={"close"} color={"#E3629B"} />
            )}
          </View>
        </View>
      </View>
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
    // @ts-ignore
    outlineStyle: "none", // Web
  },
  sideComponent: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
  },
  multiline: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
