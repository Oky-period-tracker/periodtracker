import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Button } from "./Button";
import { ErrorText } from "./ErrorText";

type SegmentValue = string | number | boolean;

type SegmentControlOption = {
  value: SegmentValue;
  label: string;
  iconName: string;
};

type SegmentControlProps = {
  selected: SegmentValue;
  options: SegmentControlOption[];
  onSelect: (value: SegmentValue) => void;
  errors?: string[]; // TODO:
  errorKey?: string; // TODO:
  errorsVisible?: boolean;
};

export const SegmentControl = ({
  selected,
  options,
  onSelect,
  errors,
  errorKey,
  errorsVisible,
}: SegmentControlProps) => {
  const hasError = errorsVisible && errorKey && errors.includes(errorKey);

  return (
    <View style={styles.container}>
      {hasError && <ErrorText>{errorKey}</ErrorText>}

      {options.map((option) => {
        const isSelected = selected === option.value;
        const onPress = () => onSelect(option.value);

        return (
          <View key={`segment-${option.value}`} style={styles.option}>
            <Button
              status={isSelected ? "primary" : "basic"}
              style={styles.iconContainer}
              onPress={onPress}
            >
              <FontAwesome
                size={20}
                // @ts-ignore // TODO:
                name={option.iconName}
                color={"#fff"}
              />
            </Button>
            <Text style={styles.optionText}>{option.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  option: {
    flexDirection: "column",
    alignItems: "center",
    margin: 4,
  },
  optionText: {
    fontSize: 12,
    textAlign: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    margin: 4,
  },
});
