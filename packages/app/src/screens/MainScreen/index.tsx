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

const MainScreen: ScreenComponent<"Home"> = (props) => {
  return (
    <DayScrollProvider>
      <MainScreenInner {...props} />
    </DayScrollProvider>
  );
};

const MainScreenInner: ScreenComponent<"Home"> = ({ navigation }) => {
  const { selectedItem, onBodyLayout, dayModalVisible, toggleDayModal } =
    useDayScroll();

  const { width } = useScreenDimensions();

  const goToCalendar = () => navigation.navigate("Calendar");

  return (
    <View style={styles.screen}>
      <View style={styles.body} onLayout={onBodyLayout}>
        <View style={styles.topLeft}>
          <CircleProgress onPress={goToCalendar} />
          <TouchableOpacity onPress={goToCalendar}>
            <Text>Calendar</Text>
          </TouchableOpacity>
          <Avatar />
        </View>

        <View style={[styles.wheelContainer, { width, right: -width / 2 }]}>
          <Wheel />
          <CenterCard />
        </View>
      </View>

      <View style={styles.carouselContainer}>
        <Carousel />
      </View>

      <DayModal
        visible={dayModalVisible}
        toggleVisible={toggleDayModal}
        date={selectedItem?.date}
      />
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
});
