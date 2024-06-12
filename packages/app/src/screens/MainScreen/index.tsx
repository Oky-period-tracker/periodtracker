import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Carousel } from "../../components/Carousel";
import { Circle } from "../../components/icons/Circle";
import { Cloud } from "../../components/icons/Cloud";
import { Star } from "../../components/icons/Star";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Button } from "../../components/Button";
import { DailyCard } from "../../components/DailyCard";

const data = [{}, {}, {}, {}, {}, {}, {}, {}];

const MainScreen: ScreenComponent<"Home"> = ({ navigation }) => {
  const goToCalendar = () => navigation.navigate("Calendar");

  return (
    <View style={styles.screen}>
      <Button
        status={"secondary"}
        style={styles.button}
        onPress={goToCalendar}
      ></Button>
      <View style={{ height: 100, width: 100 }}>
        <Cloud />
      </View>
      <View style={{ height: 100, width: 100 }}>
        <Circle />
      </View>
      <View style={{ height: 100, width: 100 }}>
        <Star />
      </View>
      <View style={styles.carouselContainer}>
        <Carousel CardComponent={DailyCard} data={data} />
      </View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
