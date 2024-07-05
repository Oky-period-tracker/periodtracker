import * as React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Carousel } from "./components/Carousel";
import { CenterCard } from "./components/CenterCard";
import { Wheel } from "./components/Wheel";
import { useScreenDimensions } from "../../hooks/useScreenDimensions";
import { DayScrollProvider, useDayScroll } from "./DayScrollContext";
import { DayModal } from "../../components/DayModal";
import { CircleProgress } from "./components/CircleProgress";
import { Text } from "../../components/Text";
import { Avatar } from "../../components/Avatar";
import { TutorialProvider, useTutorial } from "./TutorialContext";
import { TutorialTextbox } from "./components/TutorialTextbox";
import { TutorialArrow } from "./components/TutorialArrow";
import { TutorialFeature } from "./components/TutorialFeature";

const MainScreen: ScreenComponent<"Home"> = (props) => {
  return (
    <TutorialProvider>
      <DayScrollProvider>
        <MainScreenInner {...props} />
      </DayScrollProvider>
    </TutorialProvider>
  );
};

const MainScreenInner: ScreenComponent<"Home"> = ({ navigation }) => {
  const { selectedItem, onBodyLayout, dayModalVisible, toggleDayModal } =
    useDayScroll();

  const { width } = useScreenDimensions();

  const { state, step, onTopLeftLayout, onWheelLayout } = useTutorial();

  const avatarHidden = state.isActive && step !== "avatar";
  const circleProgressHidden = state.isActive;
  const wheelHidden =
    state.isActive && step !== "wheel" && step !== "wheel_button";
  const centerCardHidden =
    state.isActive && step !== "wheel" && step !== "center_card";
  const carouselHidden = state.isActive;

  const goToCalendar = () => navigation.navigate("Calendar");

  return (
    <View style={styles.screen}>
      <View style={styles.body} onLayout={onBodyLayout}>
        <View style={styles.topLeft} onLayout={onTopLeftLayout}>
          <CircleProgress
            onPress={goToCalendar}
            style={circleProgressHidden && styles.hidden}
          />
          <TouchableOpacity
            onPress={goToCalendar}
            style={circleProgressHidden && styles.hidden}
          >
            <Text>Calendar</Text>
          </TouchableOpacity>
          <Avatar style={avatarHidden && styles.hidden} />
        </View>

        <View
          style={[styles.wheelContainer, { width, right: -width / 2 }]}
          onLayout={onWheelLayout}
        >
          <Wheel style={wheelHidden && styles.hidden} />
          <CenterCard style={centerCardHidden && styles.hidden} />
        </View>
      </View>

      <View style={[styles.carouselContainer, carouselHidden && styles.hidden]}>
        <Carousel />
      </View>

      <TutorialArrow />
      <TutorialTextbox />
      <TutorialFeature />

      {selectedItem && (
        <DayModal
          visible={dayModalVisible}
          toggleVisible={toggleDayModal}
          data={selectedItem}
        />
      )}
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    width: "100%",
    flex: 1,
  },
  topLeft: {
    flex: 1,
    width: "33%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  wheelContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    marginTop: "auto",
    width: "100%",
  },
  button: {
    width: 80,
    height: 80,
    marginLeft: 40,
  },
  // Tutorial
  hidden: {
    opacity: 0.1,
  },
});
