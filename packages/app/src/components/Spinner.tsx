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
import { Text } from "./Text";
import { palette } from "../config/theme";

export const Spinner = ({ text }: { text?: string }) => {
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
      {text && <Text style={styles.text}>{text}</Text>}
      <View style={styles.container}>
        <View style={styles.inner}>
          <Image
            resizeMode="contain"
            source={assets.static.spin_load_face}
            style={styles.image}
          />
        </View>

        <Animated.View style={[animatedStyle]}>
          <Image
            resizeMode="contain"
            source={assets.static.spin_load_circle}
            style={styles.image}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const size = 120;

const styles = StyleSheet.create({
  image: {
    width: size,
    height: size,
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
    top: 0,
    left: 0,
  },
  text: {
    width: "100%",
    paddingHorizontal: 24,
    marginBottom: 24,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: palette.secondary.text,
  },
});
