import React from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native'
import { Text } from './Text'
import { useColor } from '../hooks/useColor'

const ITEM_HEIGHT = 60
const VISIBLE_ITEMS = 3
const height = ITEM_HEIGHT * VISIBLE_ITEMS

export interface WheelPickerOption {
  label: string
  value: string
  emoji?: string
}

export interface WheelPickerProps {
  initialOption: WheelPickerOption | undefined
  options: WheelPickerOption[]
  onChange: (option: WheelPickerOption | undefined) => void
  resetDeps: unknown[]
  allowUndefined?: boolean
  enableTranslate?: boolean
}

export const WheelPicker = ({
  initialOption,
  options,
  onChange,
  resetDeps,
  allowUndefined = true,
  enableTranslate = false,
}: WheelPickerProps) => {
  const { borderColor } = useColor()

  const allOptions = React.useMemo(() => {
    if (allowUndefined) {
      return [undefined, ...options]
    }
    return options
  }, [options, allowUndefined])

  const initialIndex = initialOption
    ? allOptions.findIndex((item) => item?.value === initialOption?.value)
    : 0

  const [selectedIndex, setSelectedIndex] = React.useState(initialIndex)

  const max = allOptions.length - 1
  const safeIndex = Math.min(Math.max(selectedIndex, 0), max)

  const flatListRef = React.useRef<FlatList<WheelPickerOption | undefined>>(null)
  const scrollEnabled = React.useRef<boolean>(true) // Prevents useEffect scrolling bug

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!scrollEnabled.current) {
      return
    }

    const yOffset = event.nativeEvent.contentOffset.y
    const index = Math.round(yOffset / ITEM_HEIGHT)
    setSelectedIndex(index)
  }

  const scrollToIndex = (index: number) => {
    if (index >= allOptions.length) {
      return
    }

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: false,
        viewPosition: 0,
      })
    }
  }

  // Scroll to preselect item on render
  React.useEffect(() => {
    let resetTimeout: NodeJS.Timeout

    const timeout = setTimeout(() => {
      scrollEnabled.current = false
      scrollToIndex(safeIndex)

      resetTimeout = setTimeout(() => {
        scrollEnabled.current = true
      }, 32)
    }, 32)

    return () => {
      clearTimeout(timeout)
      clearTimeout(resetTimeout)
    }
  }, resetDeps)

  React.useEffect(() => {
    const value = allOptions[safeIndex]
    onChange(value)
  }, [safeIndex])

  const renderItem = React.useCallback(
    ({ item, index }: { item: WheelPickerOption | undefined; index: number }) => {
      const isSelected = index === safeIndex
      const onPress = () => scrollToIndex(index)

      return (
        <TouchableOpacity
          key={`wheel-option-${index}`}
          onPress={onPress}
          style={[styles.item, isSelected && styles.selectedItem, isSelected && { borderColor }]}
        >
          {item?.emoji ? (
            <View style={styles.emojiTextWrapper}>
              <Text
                enableTranslate={false}
                style={[styles.emojiText, isSelected && styles.selectedItemText]}
              >
                {item.emoji}
              </Text>
              <Text
                enableTranslate={enableTranslate}
                style={[styles.emojiTextLabel, isSelected && styles.selectedItemText]}
              >
                {item.label}
              </Text>
            </View>
          ) : item ? (
            <Text
              enableTranslate={enableTranslate}
              style={[styles.text, isSelected && styles.selectedItemText]}
            >
              {item.label}
            </Text>
          ) : (
            <Text style={[styles.text, isSelected && styles.selectedItemText]}>{'select'}</Text>
          )}
        </TouchableOpacity>
      )
    },
    [safeIndex],
  )

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
        scrollEventThrottle={64}
        getItemLayout={getItemLayout}
        initialNumToRender={VISIBLE_ITEMS}
        maxToRenderPerBatch={VISIBLE_ITEMS * 2}
        windowSize={VISIBLE_ITEMS * 3}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

export const useInitialWheelOption = (
  value: string | undefined,
  options: WheelPickerOption[],
  ifOneUseFirst: boolean = false,
): WheelPickerOption | undefined => {
  return React.useMemo(() => {
    if (ifOneUseFirst && options.length === 1) {
      return options[0]
    }
    return options.find((item) => item?.value === value)
  }, [options, value])
}

const keyExtractor = (item: WheelPickerOption | undefined) => `wheel-option-${item?.label}`

const getItemLayout = (_: unknown, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
})

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  list: {
    height,
    width: '100%',
  },
  listContent: {
    paddingTop: ITEM_HEIGHT,
    paddingBottom: ITEM_HEIGHT,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  selectedItem: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  text: {
    textAlign: 'center',
  },
  emojiTextWrapper: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
  emojiText: {
    fontSize: 20,
    marginRight: 8,
  },
  emojiTextLabel: {
    flex: 1,
  },
  textWithEmoji: {
    textAlign: 'center',
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: height - ITEM_HEIGHT,
  },
})
