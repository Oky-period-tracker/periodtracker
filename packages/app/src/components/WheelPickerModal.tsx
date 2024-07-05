import {
  StyleSheet,
  // Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Input, InputProps } from "./Input";
import { Modal } from "./Modal";
import React from "react";
import { WheelPicker, WheelPickerOption } from "./WheelPicker";
import { Hr } from "./Hr";
import { useSearch } from "../hooks/useSearch";
import { SearchBar } from "./SearchBar";
import { Text } from "./Text";

export const WheelPickerModal = ({
  initialOption,
  options,
  onSelect,
  allowUndefined = true,
  searchEnabled,
  ToggleComponent,
  inputWrapperStyle,
  ...props
}: {
  initialOption: WheelPickerOption | undefined;
  options: WheelPickerOption[];
  onSelect: (value: WheelPickerOption | undefined) => void;
  allowUndefined?: boolean;
  searchEnabled?: boolean;
  ToggleComponent?: React.FC<{ onPress: () => void }>;
  inputWrapperStyle?: ViewStyle;
} & InputProps) => {
  const { query, setQuery, results } = useSearch<WheelPickerOption>({
    options,
    keys: searchKeys,
    type: "startsWith",
    enabled: searchEnabled,
  });

  const [wheelOption, setWheelOption] = React.useState<
    WheelPickerOption | undefined
  >(initialOption);

  const [visible, setIsVisible] = React.useState(false);
  const toggleVisible = () => {
    setIsVisible((current) => !current);
    setWheelOption(initialOption);
    setQuery("");
  };

  const onConfirm = () => {
    onSelect(wheelOption);
    toggleVisible();
  };

  const displayValue = initialOption?.label || props.placeholder || "";

  return (
    <>
      {ToggleComponent ? (
        <ToggleComponent onPress={toggleVisible} />
      ) : (
        <TouchableOpacity onPress={toggleVisible} style={inputWrapperStyle}>
          <Input
            {...props}
            value={displayValue}
            editable={false}
            selectTextOnFocus={false}
            displayOnly={true}
          />
        </TouchableOpacity>
      )}

      <Modal
        visible={visible}
        toggleVisible={toggleVisible}
        style={styles.modal}
      >
        <View style={styles.modalBody}>
          {searchEnabled && <SearchBar query={query} setQuery={setQuery} />}

          <WheelPicker
            initialOption={initialOption}
            options={results}
            onChange={setWheelOption}
            resetDeps={[visible]}
            allowUndefined={allowUndefined}
          />
        </View>

        <Hr />
        <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const searchKeys = ["label" as const];

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  modalBody: {
    paddingVertical: 24,
    paddingHorizontal: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  confirm: {
    padding: 24,
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
