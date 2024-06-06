import React from "react";
import { View, ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AnimatedContainer = ({ style, children }: ViewProps) => {
  const height = useSharedValue(0);

  const onContentLayout = (event) => {
    const newHeight = event.nativeEvent.layout.height;
    height.value = withTiming(newHeight, { duration: 350 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      overflow: "hidden",
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>
      <View onLayout={onContentLayout}>{children}</View>
    </Animated.View>
  );
};

export default AnimatedContainer;
