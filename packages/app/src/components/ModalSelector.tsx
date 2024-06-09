import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input, InputProps } from "./Input";
import { Modal } from "./Modal";
import React from "react";
import { WheelPicker } from "./WheelPicker";
import { Hr } from "./Hr";

export const ModalSelector = ({
  value,
  options,
  onSelect,
  ...props
}: InputProps & {
  options: string[];
  onSelect: (value: string) => void;
}) => {
  const initialIndex = options.indexOf(value);
  const [selectedIndex, setSelectedIndex] = React.useState(initialIndex);
  const selectedOption = options[selectedIndex];

  const [visible, setIsVisible] = React.useState(false);
  const toggleVisible = () => {
    setIsVisible((current) => !current);
    setSelectedIndex(initialIndex);
  };

  const onConfirm = () => {
    onSelect(selectedOption);
    toggleVisible();
  };

  return (
    <>
      <TouchableOpacity onPress={toggleVisible}>
        <Input
          {...props}
          value={value}
          editable={false}
          selectTextOnFocus={false}
          displayOnly={true}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        toggleVisible={toggleVisible}
        style={styles.modal}
      >
        <View style={styles.modalBody}>
          <Text style={styles.title}>{props.placeholder}</Text>
          <WheelPicker
            selectedIndex={selectedIndex}
            options={options}
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
