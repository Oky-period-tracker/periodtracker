import React from "react";
import { Button } from "./Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View } from "react-native";
import { useToggle } from "../hooks/useToggle";
import { Modal } from "./Modal";
import { Text } from "./Text";
import { useTranslate } from "../hooks/useTranslate";

type InfoButtonProps = {
  title: string;
  content: string;
  accessibilityLabel?: string;
};

export const InfoButton = ({
  title,
  content,
  accessibilityLabel,
}: InfoButtonProps) => {
  const [visible, toggleVisible] = useToggle();
  const translate = useTranslate();

  return (
    <>
      <Button
        onPress={toggleVisible}
        style={styles.default}
        status={"danger_light"}
        accessibilityLabel={accessibilityLabel ?? translate("info_button")}
      >
        <FontAwesome size={12} name={"info"} color={"#fff"} />
      </Button>

      <Modal visible={visible} toggleVisible={toggleVisible}>
        <View style={styles.modal}>
          <Text style={styles.title} status={"primary"}>
            {title}
          </Text>
          <Text>{content}</Text>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  default: {
    height: 24,
    width: 24,
  },
  modal: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
