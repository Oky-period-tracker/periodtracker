import * as React from "react";
import { View, StyleSheet } from "react-native";
// import { Carousel } from "../../components/Carousel";
// import { Circle } from "../../components/icons/Circle";
// import { Cloud } from "../../components/icons/Cloud";
// import { Star } from "../../components/icons/Star";
import { ScreenComponent } from "../../navigation/RootNavigator";
// import { Button } from "../../components/Button";
// import { DailyCard } from "../../components/DailyCard";
// import { DayModal } from "../../components/DayModal";
// import { useToggle } from "../../hooks/useToggle";
import { Wheel } from "./components/Wheel";
import { useScreenDimensions } from "../../hooks/useScreenDimensions";

// const data = [{}, {}, {}, {}, {}, {}, {}, {}];

const MainScreen: ScreenComponent<"Home"> = (/* { navigation } */) => {
  // const goToCalendar = () => navigation.navigate("Calendar");
  // const goToDay = () => navigation.navigate("Day");

  // const [visible, toggleVisible] = useToggle();

  const { width } = useScreenDimensions();

  return (
    <View style={styles.screen}>
      <View style={[styles.wheelContainer, { right: -width / 2 }]}>
        <Wheel />
      </View>
    </View>
  );

  // return (
  //   <View style={styles.screen}>
  //     <Button
  //       status={"secondary"}
  //       style={styles.button}
  //       onPress={goToCalendar}
  //     ></Button>

  //     <Cloud size={100} />
  //     <Circle size={100} />
  //     <Star size={100} />

  //     <View style={styles.carouselContainer}>
  //       <Carousel data={data} CardComponent={DailyCard} onCardPress={goToDay} />
  //       <DayModal {...{ visible, toggleVisible }} />
  //     </View>
  //   </View>
  // );
};

export default MainScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
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
  },
  button: {
    width: 80,
    height: 80,
    marginLeft: 40,
  },
});
