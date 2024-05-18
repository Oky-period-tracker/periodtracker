import * as React from "react";
import { View, StyleSheet } from "react-native";
import Carousel from "../../components/Carousel";
import { Circle } from "../../components/Circle";
import { Cloud } from "../../components/Cloud";
import { Star } from "../../components/Star";

const data = [{}, {}, {}, {}, {}, {}, {}, {}];

function MainScreen({ navigation }) {
  return (
    <View style={styles.screen}>
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
