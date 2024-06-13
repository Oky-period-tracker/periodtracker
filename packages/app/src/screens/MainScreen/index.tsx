import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Carousel } from "../../components/Carousel";
import { Circle } from "../../components/icons/Circle";
import { Cloud } from "../../components/icons/Cloud";
import { Star } from "../../components/icons/Star";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Button } from "../../components/Button";
import { DailyCard } from "../../components/DailyCard";
import { DayModal } from "../../components/DayModal";
import { useToggle } from "../../hooks/useToggle";

const data = [{}, {}, {}, {}, {}, {}, {}, {}];

const MainScreen: ScreenComponent<"Home"> = ({ navigation }) => {
  const goToCalendar = () => navigation.navigate("Calendar");

  const [visible, toggleVisible] = useToggle();

  return (
    <View style={styles.screen}>
      <Button
        status={"secondary"}
        style={styles.button}
        onPress={goToCalendar}
      ></Button>

      <Cloud size={100} />
      <Circle size={100} />
      <Star size={100} />

      <View style={styles.carouselContainer}>
        <Carousel
          data={data}
          CardComponent={DailyCard}
          onCardPress={toggleVisible}
        />
        <DayModal {...{ visible, toggleVisible }} />
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
