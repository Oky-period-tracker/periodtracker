import { StyleSheet, Text, View } from "react-native";
import { Modal, ModalProps } from "./Modal";
import Cloud from "./icons/Cloud";
import { TouchableOpacity } from "react-native-gesture-handler";

export const DayModal = ({ visible, toggleVisible }: ModalProps) => {
  return (
    <Modal visible={visible} toggleVisible={toggleVisible} style={styles.modal}>
      <Text style={styles.title}>Did you have your period today?</Text>
      <Text style={styles.description}>
        Tell Oky about your period to get better predictions, did you have your
        period today?
      </Text>

      <Cloud size={160} status={"secondary"} />

      <View style={styles.buttons} pointerEvents="box-none">
        <TouchableOpacity>
          <Cloud size={100} status={"danger"} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Cloud size={100} status={"neutral"} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  description: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  dateIcon: {
    width: 160,
    height: 160,
  },
  buttons: {
    marginTop: 48,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
});
