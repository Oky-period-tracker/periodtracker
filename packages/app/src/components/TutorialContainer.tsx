import React from "react";
import {
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTutorial } from "../screens/MainScreen/TutorialContext";
import { useThrottledFunction } from "../hooks/useThrottledFunction";
import { TutorialSkip } from "../screens/MainScreen/components/TutorialSkip";

export type TutorialContainerProps = {
  children?: React.ReactNode;
};

export const TutorialContainer = ({ children }: TutorialContainerProps) => {
  const { dispatch } = useTutorial();

  const onContinue = () => {
    dispatch({ type: "continue" });
  };

  // Prevent double clicking
  const continueThrottled = useThrottledFunction(onContinue, 350);

  return (
    <RNModal
      visible={true}
      animationType={"fade"}
      transparent={true}
      statusBarTranslucent={true}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View style={styles.container}>
        <TutorialSkip />
        <View style={styles.backDrop} />
        <TouchableOpacity
          style={styles.touchableOverlay}
          onPress={continueThrottled}
        />
        {children}
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
    zIndex: -1,
  },
  touchableOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  container: {
    height: "100%",
    width: "100%",
    paddingTop: 120, //Header height
    paddingBottom: 80, // TabBar height
  },
});
