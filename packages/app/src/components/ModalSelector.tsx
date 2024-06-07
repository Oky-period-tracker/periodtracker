import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Input, InputProps } from "./Input";
import { useToggle } from "../hooks/useToggle";
import { Modal } from "./Modal";

export const ModalSelector = ({
  options,
  onSelect,
  ...props
}: InputProps & {
  options: string[];
  onSelect: (value: string) => void;
}) => {
  const [visible, toggleVisible] = useToggle();

  return (
    <>
      <TouchableOpacity onPress={toggleVisible}>
        <Input
          {...props}
          editable={false}
          selectTextOnFocus={false}
          displayOnly={true}
        />
      </TouchableOpacity>

      <Modal visible={visible} toggleVisible={toggleVisible}>
        <View style={styles.modalBody}>
          <Text style={styles.title}>{props.placeholder}</Text>
          <ScrollView>
            {options.map((option, i) => {
              const onPress = () => {
                onSelect(option);
                toggleVisible();
              };

              return (
                <TouchableOpacity
                  key={`${option}-${i}`}
                  onPress={onPress}
                  style={styles.option}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBody: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  option: {
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    margin: 8,
    padding: 8,
  },
  optionText: {
    textAlign: "center",
  },
});
