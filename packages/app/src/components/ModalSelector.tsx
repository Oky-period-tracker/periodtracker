import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input, InputProps } from "./Input";
import { Modal } from "./Modal";
import React from "react";
import { WheelPicker, WheelPickerOption } from "./WheelPicker";
import { Hr } from "./Hr";
import { useSearch } from "../hooks/useSearch";

export const ModalSelector = ({
  displayValue,
  options,
  onSelect,
  searchEnabled,
  ToggleComponent,
  ...props
}: InputProps & {
  options: WheelPickerOption[];
  onSelect: (value: unknown) => void;
  displayValue?: string;
  searchEnabled?: boolean;
  ToggleComponent?: React.FC<{ onPress: () => void }>;
}) => {
  const currentIndex = options.findIndex((item) => item.label === displayValue);
  const initialIndex = Math.max(currentIndex, 0);
  const [selectedIndex, setSelectedIndex] = React.useState(initialIndex);

  const { query, setQuery, results } = useSearch<WheelPickerOption>({
    options,
    keys: searchKeys,
    type: "startsWith",
    enabled: searchEnabled,
  });

  const [visible, setIsVisible] = React.useState(false);
  const toggleVisible = () => {
    setIsVisible((current) => !current);
    setSelectedIndex(initialIndex);
    setQuery("");
  };

  const onConfirm = () => {
    onSelect(results[selectedIndex].value);
    toggleVisible();
  };

  return (
    <>
      {ToggleComponent ? (
        <ToggleComponent onPress={toggleVisible} />
      ) : (
        <TouchableOpacity onPress={toggleVisible}>
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
          {searchEnabled && (
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder={"search"}
            />
          )}

          <WheelPicker
            selectedIndex={selectedIndex}
            options={results}
            onChange={setSelectedIndex}
            resetDeps={[visible]}
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
