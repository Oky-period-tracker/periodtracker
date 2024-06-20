import * as React from "react";
import { View, StyleSheet } from "react-native";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Carousel } from "../../components/Carousel";
import { CenterCard } from "./components/CenterCard";
import { Wheel } from "./components/Wheel";
import { useScreenDimensions } from "../../hooks/useScreenDimensions";
import { Button } from "../../components/Button";
import { DayScrollProvider, useDayScroll } from "./DayScrollContext";

const MainScreen: ScreenComponent<"Home"> = (props) => {
  return (
    <DayScrollProvider>
      <MainScreenInner {...props} />
    </DayScrollProvider>
  );
};

const MainScreenInner: ScreenComponent<"Home"> = ({ navigation }) => {
  const goToCalendar = () => navigation.navigate("Calendar");

  const { width } = useScreenDimensions();

  const { onBodyLayout } = useDayScroll();

  return (
    <View style={styles.screen}>
      <View style={styles.body} onLayout={onBodyLayout}>
        <Button
          status={"secondary"}
          style={styles.button}
          onPress={goToCalendar}
        />

        <View style={[styles.wheelContainer, { right: -width / 2 }]}>
          <CenterCard />
          <Wheel />
        </View>
      </View>

      <View style={styles.carouselContainer}>
        <Carousel />
      </View>
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
    height: 200,
  },
  button: {
    width: 80,
    height: 80,
    marginLeft: 40,
  },
});
