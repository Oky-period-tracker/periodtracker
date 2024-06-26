import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Modal, ModalProps } from "./Modal";
import Cloud from "./icons/Cloud";
import { IconButton } from "./IconButton";
import { Moment } from "moment";
import { formatMomentDayMonth } from "../services/utils";

export const DayModal = ({
  date,
  visible,
  toggleVisible,
}: { date?: Moment } & ModalProps) => {
  if (!date) {
    return null;
  }

  const onYesPress = () => {
    // TODO:
  };

  const onNoPress = () => {
    // TODO:
  };

  return (
    <Modal visible={visible} toggleVisible={toggleVisible} style={styles.modal}>
      <Text style={styles.title}>Did you have your period today?</Text>
      <Text style={styles.description}>
        Tell Oky about your period to get better predictions, did you have your
        period today?
      </Text>

      <IconButton
        Icon={Cloud}
        size={160}
        text={formatMomentDayMonth(date)}
        status={"basic"}
      />

      <View style={styles.buttons} pointerEvents="box-none">
        <IconButton
          Icon={Cloud}
          onPress={onYesPress}
          size={100}
          text={"Yes"}
          status={"danger"}
        />
        <IconButton Icon={Cloud} onPress={onNoPress} size={100} text={"No"} />
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
