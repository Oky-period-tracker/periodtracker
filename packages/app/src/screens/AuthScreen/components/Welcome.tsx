import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Swiper } from "../../../components/Swiper";
import { Button } from "../../../components/Button";
import { useAuthMode } from "../AuthModeContext";

export const Welcome = () => {
  const [index, setIndex] = React.useState(0);
  const pages = [
    <View key="page1" style={styles.page}>
      <Text>Page 1</Text>
    </View>,
    <View key="page2" style={styles.page}>
      <Text>Page 2</Text>
    </View>,
    <View key="page3" style={styles.page}>
      <Text>Page 3</Text>
    </View>,
  ];

  return (
    <Swiper
      index={index}
      setIndex={setIndex}
      pages={pages}
      renderActionRight={renderActionRight}
    />
  );
};

const renderActionRight = (currentPage: number, total: number) => {
  const { setAuthMode } = useAuthMode();
  const onPress = () => setAuthMode("start");

  const isLastPage = currentPage === total - 1;
  const opacity = isLastPage ? 1 : 0;

  return (
    <Button
      onPress={onPress}
      style={[styles.button, { opacity }]}
      status={"secondary"}
    >
      Continue
    </Button>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginLeft: "auto",
  },
});
