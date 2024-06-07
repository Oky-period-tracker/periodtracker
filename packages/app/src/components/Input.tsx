import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ErrorText } from "./ErrorText";
import { Button } from "./Button";

export type InputProps = TextInputProps & {
  info?: string;
  errors?: string[]; // TODO:
  errorKey?: string; // TODO:
  errorsVisible?: boolean;
  displayOnly?: boolean;
};

export const Input = ({
  value,
  placeholder,
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
      <View style={styles.wrapper}>
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
            style={styles.input}
            placeholderTextColor={placeholderTextColor}
          />
        )}
        <View style={styles.sideComponent}>
          {hasError && (
            <FontAwesome size={16} name={"close"} color={"#E3629B"} />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    margin: 8,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    padding: 12,
  },
  input: {
    flex: 1,
    textAlign: "center",
  },
  sideComponent: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
  },
});
