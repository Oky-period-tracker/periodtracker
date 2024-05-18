import * as React from "react";
import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";
import Carousel from "../../components/Carousel";
// import { Button } from "../../components/Button";

const data = [{}, {}, {}, {}, {}, {}, {}, {}];

function MainScreen({ navigation }) {
  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.text}>Image Carousel Square</Text>
      <Carousel data={data} pagination={true} />
    </View>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white",
  },
  text: { textAlign: "center", color: "black", marginBottom: 10 },
  carouselContainer: {
    marginBottom: 20,
  },
});
