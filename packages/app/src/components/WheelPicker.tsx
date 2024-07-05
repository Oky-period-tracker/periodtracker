import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from "react-native";
import { Text } from "./Text";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;
const height = ITEM_HEIGHT * VISIBLE_ITEMS;

export type WheelPickerOption = {
  label: string;
  value: string;
};

export type WheelPickerProps = {
  initialOption: WheelPickerOption | undefined;
  options: WheelPickerOption[];
  onChange: (option: WheelPickerOption | undefined) => void;
  resetDeps: unknown[];
  allowUndefined?: boolean;
};

export const WheelPicker = ({
  initialOption,
  options,
  onChange,
  resetDeps,
  allowUndefined = true,
}: WheelPickerProps) => {
  const allOptions = React.useMemo(() => {
    if (allowUndefined) {
      return [undefined, ...options];
    }
    return options;
  }, [options, allowUndefined]);

  const initialIndex = initialOption
    ? allOptions.findIndex((item) => item?.value === initialOption?.value)
    : 0;

  const [selectedIndex, setSelectedIndex] = React.useState(initialIndex);

  const max = allOptions.length - 1;
  const safeIndex = Math.min(Math.max(selectedIndex, 0), max);

  const flatListRef =
    React.useRef<FlatList<WheelPickerOption | undefined>>(null);
  const scrollEnabled = React.useRef<boolean>(true); // Prevents useEffect scrolling bug

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!scrollEnabled.current) {
      return;
    }

    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    setSelectedIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (index >= allOptions.length) {
      return;
    }

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: false,
        viewPosition: 0,
      });
    }
  };

  // Scroll to preselect item on render
  React.useEffect(() => {
    let resetTimeout: NodeJS.Timeout;

    const timeout = setTimeout(() => {
      scrollEnabled.current = false;
      scrollToIndex(safeIndex);

      resetTimeout = setTimeout(() => {
        scrollEnabled.current = true;
      }, 32);
    }, 32);

    return () => {
      clearTimeout(timeout);
      clearTimeout(resetTimeout);
    };
  }, resetDeps);

  React.useEffect(() => {
    const value = allOptions[safeIndex];
    onChange(value);
  }, [safeIndex]);

  const renderItem = React.useCallback(
    ({
      item,
      index,
    }: {
      item: WheelPickerOption | undefined;
      index: number;
    }) => {
      const isSelected = index === safeIndex;
      const onPress = () => scrollToIndex(index);

      return (
        <TouchableOpacity
          key={`wheel-option-${index}`}
          onPress={onPress}
          style={[styles.item, isSelected && styles.selectedItem]}
        >
          <Text style={isSelected ? styles.selectedItemText : undefined}>
            {item ? item.label : "Select"}
          </Text>
        </TouchableOpacity>
      );
    },
    [safeIndex]
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={allOptions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={handleScroll}
        getItemLayout={getItemLayout}
        initialNumToRender={VISIBLE_ITEMS}
        maxToRenderPerBatch={VISIBLE_ITEMS * 2}
        windowSize={VISIBLE_ITEMS * 3}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export const useInitialWheelOption = (
  value: string | undefined,
  options: WheelPickerOption[]
): WheelPickerOption | undefined => {
  return React.useMemo(() => {
    return options.find((item) => item?.value === value);
  }, [options, value]);
};

const keyExtractor = (item: WheelPickerOption | undefined) =>
  `wheel-option-${item?.label}`;

const getItemLayout = (_: unknown, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  list: {
    height,
    width: "100%",
  },
  listContent: {
    paddingTop: ITEM_HEIGHT,
    paddingBottom: ITEM_HEIGHT,
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
