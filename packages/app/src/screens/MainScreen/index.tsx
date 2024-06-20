import * as React from "react";
import { View, StyleSheet } from "react-native";

import { ScreenComponent } from "../../navigation/RootNavigator";

import { Carousel } from "../../components/Carousel";

// const data = [{}, {}, {}, {}, {}, {}, {}, {}];

const MainScreen: ScreenComponent<"Home"> = (/* { navigation } */) => {
  // const goToCalendar = () => navigation.navigate("Calendar");
  // const goToDay = () => navigation.navigate("Day");

  // const [visible, toggleVisible] = useToggle();

  // const { width } = useScreenDimensions();

  // return (
  //   <View style={styles.screen}>
  //     <View style={[styles.wheelContainer, { right: -width / 2 }]}>
  //       <CenterCard />
  //       <Wheel />
  //     </View>
  //   </View>
  // );

  // ==================

  // const goToCalendar = () => navigation.navigate("Calendar");

  // return (
  //   <View style={styles.screen}>
  //     <Button
  //       status={"secondary"}
  //       style={styles.button}
  //       onPress={goToCalendar}
  //     />
  //   </View>
  // );

  // ==================

  return (
    <View style={styles.screen}>
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
