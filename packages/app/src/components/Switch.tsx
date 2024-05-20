import { StyleSheet, View } from "react-native";
import { Button } from "./Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setData } from "../redux/reducers/appReducer";

export const Switch = () => {
  // @ts-ignore TODO: Move redux outside the switch(?)
  const isSwitchedOn = useSelector((state) => state.app.data);
  const dispatch = useDispatch();

  const onYesPress = () => {
    dispatch(setData(true));
  };

  const onNoPress = () => {
    dispatch(setData(false));
  };

  return (
    <View style={styles.container}>
      <Button
        status={isSwitchedOn ? "primary" : "basic"}
        style={styles.iconContainer}
        onPress={onYesPress}
      >
        <FontAwesome size={20} name={"check"} color={"#fff"} />
      </Button>
      <Button
        status={!isSwitchedOn ? "danger" : "basic"}
        style={styles.iconContainer}
        onPress={onNoPress}
      >
        <FontAwesome size={20} name={"close"} color={"#fff"} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    margin: 4,
  },
});
