import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { assets } from "../assets";

export const Spinner = () => {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Animated.View style={[styles.row, animatedStyle]}>
          <View style={styles.wrapper}>
            <View style={[styles.semiCircle, styles.a]} />
          </View>
          <View style={[styles.wrapper, styles.flipped]}>
            <View style={[styles.semiCircle, styles.b]} />
          </View>
        </Animated.View>

        <View style={styles.inner}>
          <Image
            resizeMode="contain"
            source={assets.static.spin_load_face}
            style={styles.image}
          />
        </View>
      </View>
    </View>
  );
};

const size = 120;

const styles = StyleSheet.create({
  image: {
    width: size * 0.8,
    height: size * 0.8,
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: size,
    height: size,
  },
  inner: {
    position: "absolute",
    top: size * 0.1,
    left: size * 0.1,
    width: size * 0.8,
    height: size * 0.8,
    borderRadius: 999,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
  },
  wrapper: {
    width: size / 2,
    height: size,
    overflow: "hidden",
  },
  flipped: {
    transform: [{ rotate: "180deg" }],
  },
  semiCircle: {
    width: size,
    height: size,
    borderRadius: size / 2,
  },
  a: {
    backgroundColor: "#2AB9CB",
  },
  b: {
    backgroundColor: "#F59202",
  },
});
