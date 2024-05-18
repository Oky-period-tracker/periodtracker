import * as React from "react";
import { View, StyleSheet } from "react-native";
import Carousel from "../../components/Carousel";
import { Screen } from "../../components/Screen";
import { CircleSvg } from "../../components/Circle";

const data = [{}, {}, {}, {}, {}, {}, {}, {}];

function MainScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <CircleSvg />
      <View style={styles.carouselContainer}>
        <Carousel data={data} />
      </View>
    </View>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  carouselContainer: {
    marginTop: "auto",
  },
});
