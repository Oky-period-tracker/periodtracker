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
import { useFocusEffect } from "@react-navigation/native";
import { useFetchSurvey } from "../../hooks/useFetchSurvey";
import {
  useLoading,
  useStopLoadingEffect,
} from "../../contexts/LoadingProvider";
import { AvatarMessageProvider } from "../../contexts/AvatarMessageContext";

const MainScreen: ScreenComponent<"Home"> = (props) => {
  useFetchSurvey();
  useStopLoadingEffect();

  return (
    <AvatarMessageProvider>
      <DayScrollProvider>
        <TutorialProvider>
          <MainScreenInner {...props} />
        </TutorialProvider>
      </DayScrollProvider>
    </AvatarMessageProvider>
  );
};

const MainScreenInner: ScreenComponent<"Home"> = ({ navigation, route }) => {
  const { selectedItem, onBodyLayout, dayModalVisible, toggleDayModal } =
    useDayScroll();

  const { setLoading } = useLoading();
  const { width } = useScreenDimensions();

  const {
    state,
    step,
    onTopLeftLayout,
    onWheelLayout,
    dispatch: tutorialDispatch,
  } = useTutorial();

  // Auto start tutorial due to route params
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.tutorial) {
        setLoading(true);
        tutorialDispatch({ type: "start", value: route.params?.tutorial });
        // Reset to prevent re-triggering
        navigation.setParams({ tutorial: undefined });
      }
    }, [route.params?.tutorial])
  );

  const avatarHidden = state.isPlaying && step !== "avatar";
  const circleProgressHidden = state.isPlaying && step !== "calendar";
  const wheelHidden =
    state.isPlaying && step !== "wheel" && step !== "wheel_button";
  const centerCardHidden =
    state.isPlaying && step !== "wheel" && step !== "center_card";
  const carouselHidden =
    state.isPlaying && !["track", "summary", "stars"].includes(step ?? "");

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
    zIndex: 999, // Keep Avatar(Message) above Wheel
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
    opacity: 0.05,
  },
});
