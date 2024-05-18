import * as React from "react";
import { View, StyleSheet } from "react-native";
import Carousel from "../../components/Carousel";
import { Screen } from "../../components/Screen";

const data = [{}, {}, {}, {}, {}, {}, {}, {}];

function MainScreen({ navigation }) {
  return (
    <View style={styles.screen}>
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
