import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from "react-native";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;
const height = ITEM_HEIGHT * VISIBLE_ITEMS;

export type WheelPickerProps = {
  selectedIndex: number;
  options: string[];
  onChange: (i: number) => void;
  resetDeps: unknown[];
};

export const WheelPicker = ({
  selectedIndex,
  options,
  onChange,
  resetDeps,
}: WheelPickerProps) => {
  const scrollViewRef = React.useRef(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    onChange(index);
  };

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: false,
      });
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToIndex(selectedIndex);
    }, 32);

    return () => {
      clearTimeout(timeout);
    };
  }, resetDeps);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollToOverflowEnabled={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={"fast"}
        scrollEventThrottle={16}
        bounces={false}
      >
        {options.map((item, index) => {
          const isSelected = index === selectedIndex;
          const onPress = () => scrollToIndex(index);

          return (
            <TouchableOpacity
              key={`wheel-option-${index}`}
              onPress={onPress}
              style={[styles.item, isSelected && styles.selectedItem]}
            >
              <Text style={isSelected && styles.selectedItemText}>{item}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  scrollView: {
    height,
    paddingTop: ITEM_HEIGHT,
    width: "100%",
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  selectedItem: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSpace: {
    height: height - ITEM_HEIGHT,
  },
});
