import moment, { Moment } from 'moment'
import React from 'react'
import { LayoutChangeEvent } from 'react-native'
import { Gesture, PanGesture } from 'react-native-gesture-handler'
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  AnimatedStyle,
  runOnJS,
  SharedValue,
  withSpring,
} from 'react-native-reanimated'
import _ from 'lodash'
import { useToggle } from '../../hooks/useToggle'
import { useCalculateFullInfoForDateRange } from '../../contexts/PredictionProvider'
import { PredictionDayInfo } from '../../prediction'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { useResponsive } from '../../contexts/ResponsiveContext'

export type DayData = PredictionDayInfo

interface DayScrollConstants {
  CARD_WIDTH: number
  CARD_MARGIN: number
  FULL_CARD_WIDTH: number
  CARD_SCALED_DIFFERENCE: number
  BUTTON_SIZE: number
  NUMBER_OF_BUTTONS: number
}

interface DayScrollState {
  startDate: Moment
  endDate: Moment
  currentIndex: number
  offset: number
}

export interface DayScrollContext {
  state: DayScrollState
  data: DayData[]
  selectedItem: DayData | null
  selectedIndex: SharedValue<number> | null
  constants: DayScrollConstants
  onBodyLayout: (event: LayoutChangeEvent) => void
  isDragging: React.MutableRefObject<boolean> | null
  // Carousel
  carouselPanGesture: PanGesture
  translationX: SharedValue<number> | null
  offset: SharedValue<number> | null
  totalOffset: SharedValue<number> | null
  selectedScale: SharedValue<number> | null
  // Wheel
  calculateButtonPosition: (index: number) => { top: number; left: number }
  wheelPanGesture: PanGesture
  wheelAnimatedStyle: AnimatedStyle
  rotationAngle: SharedValue<number> | null
  diameter: number
  visible: boolean
  // Modal
  dayModalVisible: boolean
  toggleDayModal: () => void
}

const RESET_DURATION = 8000
const SCROLL_SPEED_MULTIPLIER = 2
const SETTLE_DURATION = 350
const SELECTED_SCALE = 1.2
const SPRING_CONFIG = {
  damping: 5,
  stiffness: 300,
}

const getInitialState = (index: number) => {
  const today = moment().startOf('day')
  const todayMinusSevenDays = moment(today.clone().add(-7, 'days'))
  const todaysPlusFourDays = moment(today.clone().add(4, 'days'))

  const initialState: DayScrollState = {
    startDate: todayMinusSevenDays,
    endDate: todaysPlusFourDays,
    currentIndex: index,
    offset: 0,
  }

  return initialState
}

const defaultValue: DayScrollContext = {
  state: getInitialState(6), // 12/2
  data: [],
  selectedItem: null,
  constants: {
    BUTTON_SIZE: 80,
    CARD_MARGIN: 32,
    CARD_SCALED_DIFFERENCE: 44,
    CARD_WIDTH: 220,
    FULL_CARD_WIDTH: 252,
    NUMBER_OF_BUTTONS: 12,
  },
  selectedIndex: null,
  onBodyLayout: () => {
    //
  },
  isDragging: null,
  // Carousel
  carouselPanGesture: Gesture.Pan(),
  translationX: null,
  offset: null,
  totalOffset: null,
  selectedScale: null,
  // Wheel
  wheelPanGesture: Gesture.Pan(),
  wheelAnimatedStyle: {
    //
  },
  rotationAngle: null,
  calculateButtonPosition: () => {
    return {
      top: 0,
      left: 0,
    }
  },
  diameter: 0,
  visible: false,
  // Modal
  dayModalVisible: false,
  toggleDayModal: () => {
    //
  },
}

const DayScrollContext = React.createContext<DayScrollContext>(defaultValue)

export const DayScrollProvider = ({ children }: React.PropsWithChildren) => {
  const { UIConfig } = useResponsive()
  // Carousel
  const CARD_WIDTH = UIConfig.carousel.cardWidth
  const CARD_MARGIN = UIConfig.carousel.cardMargin
  const FULL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN
  const SELECTED_WIDTH = CARD_WIDTH * SELECTED_SCALE
  const FULL_SELECTED_WIDTH = SELECTED_WIDTH + CARD_MARGIN
  const CARD_SCALED_DIFFERENCE = FULL_SELECTED_WIDTH - FULL_CARD_WIDTH

  // Wheel
  const BUTTON_SIZE = 80
  const NUMBER_OF_BUTTONS = 12
  const ANGLE_FULL_CIRCLE = 2 * Math.PI
  const ANGLE_BETWEEN_BUTTONS = ANGLE_FULL_CIRCLE / NUMBER_OF_BUTTONS
  const ROTATION_PER_PIXEL_DRAGGED = ANGLE_BETWEEN_BUTTONS / FULL_CARD_WIDTH

  const INITIAL_INDEX = NUMBER_OF_BUTTONS / 2
  const INITIAL_X = -FULL_CARD_WIDTH * (NUMBER_OF_BUTTONS / 2)

  const constants: DayScrollConstants = {
    CARD_WIDTH,
    CARD_MARGIN,
    FULL_CARD_WIDTH,
    CARD_SCALED_DIFFERENCE,
    BUTTON_SIZE,
    NUMBER_OF_BUTTONS,
  }

  // ================ State ================ //
  const [state, setState] = React.useState(getInitialState(INITIAL_INDEX))
  const { startDate, endDate } = state

  const isDragging = React.useRef(false)
  const setIsDragging = (value: boolean) => {
    isDragging.current = value
  }

  const getAdjustedIndex = (index: number) => {
    'worklet'
    return index >= 0 ? index : index + NUMBER_OF_BUTTONS
  }

  const handleInfiniteData = (indexChange: number) => {
    if (indexChange === 0) {
      return
    }

    setState((current) => ({
      ...state,
      startDate: current.startDate.add(indexChange, 'days'),
      endDate: current.endDate.add(indexChange, 'days'),
      currentIndex: getAdjustedIndex(current.currentIndex + indexChange),
      offset: (current.offset + indexChange) % NUMBER_OF_BUTTONS,
    }))
  }

  const fullInfoForDateRange = useCalculateFullInfoForDateRange(startDate, endDate)

  const [diameter, setDiameter] = React.useState(0)
  const radius = diameter / 2

  const onBodyLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setDiameter(height) //
  }

  const [visible, setVisible] = React.useState(false)
  const onSizeSettled = () => {
    setVisible(true)
  }
  // Reduce jerky initial render
  useDebounceEffect(onSizeSettled, 500, [diameter])

  const [dayModalVisible, toggleDayModal] = useToggle()

  // ================ Shared Values ================ //
  const selectedIndex = useSharedValue(INITIAL_INDEX)
  const selectedScale = useSharedValue(SELECTED_SCALE)
  const offset = useSharedValue(0)
  const totalOffset = useSharedValue(0)
  const disabled = useSharedValue(false)
  const isActive = useSharedValue(false)

  // Carousel
  const translationX = useSharedValue(INITIAL_X)
  const totalTranslationX = useSharedValue(INITIAL_X)

  // Wheel
  const rotationAngle = useSharedValue(0)
  const totalRotation = useSharedValue(0)

  // Ensure scrolling doesn't lock
  React.useEffect(() => {
    runOnJS(() => {
      disabled.value = false
    })()
  }, [state])

  // Reset
  React.useEffect(() => {
    if (!isActive.value) {
      return
    }

    const timeout = setTimeout(() => {
      selectedIndex.value = INITIAL_INDEX
      offset.value = 0
      totalOffset.value = 0
      disabled.value = false

      translationX.value = withTiming(INITIAL_X)
      totalTranslationX.value = withTiming(INITIAL_X)

      rotationAngle.value = withTiming(0)
      totalRotation.value = withTiming(0)

      setState(getInitialState(INITIAL_INDEX))
      isActive.value = false
    }, RESET_DURATION)

    return () => {
      isActive.value = false
      clearTimeout(timeout)
    }
  }, [state.currentIndex])

  const data = reorderData(fullInfoForDateRange, state.offset)
  const selectedItem = data[state.currentIndex]

  // ================ Carousel Worklet ================ //
  const calculateClosestCardPosition = (position: number) => {
    'worklet'
    const closestIndex = Math.round(position / FULL_CARD_WIDTH)
    const closestPosition = closestIndex * FULL_CARD_WIDTH
    return closestPosition
  }

  // ================ Wheel Worklets ================ //
  const calculateButtonPosition = (index: number) => {
    const distanceFromCenter = radius - BUTTON_SIZE / 2
    const x = distanceFromCenter * Math.cos(index * ANGLE_BETWEEN_BUTTONS)
    const y = distanceFromCenter * Math.sin(index * ANGLE_BETWEEN_BUTTONS)
    const top = y + distanceFromCenter
    const left = x + distanceFromCenter
    return { top, left }
  }

  const calculateRotationAngle = (displacement: number) => {
    'worklet'
    const angle = displacement * ROTATION_PER_PIXEL_DRAGGED
    return Math.min(angle, ANGLE_FULL_CIRCLE)
  }

  const calculateClosestSegmentAngle = (angle: number) => {
    'worklet'
    const segmentIndex = Math.round(angle / ANGLE_BETWEEN_BUTTONS)
    return segmentIndex * ANGLE_BETWEEN_BUTTONS
  }

  // ================ Handle Gestures ================ //
  const handlePanStart = () => {
    'worklet'
    if (disabled.value) {
      return
    }

    runOnJS(setIsDragging)(true)

    selectedIndex.value = -1
    selectedScale.value = 1
  }

  const handlePanUpdate = (displacement: number) => {
    'worklet'
    if (disabled.value) {
      return
    }

    // Carousel
    translationX.value = totalTranslationX.value + displacement

    // Wheel
    const angle = calculateRotationAngle(displacement)
    rotationAngle.value = totalRotation.value + angle
  }

  const handlePanEnd = (displacement: number) => {
    'worklet'
    if (disabled.value) {
      return
    }

    disabled.value = true
    isActive.value = true

    const change = Math.round(-displacement / FULL_CARD_WIDTH)
    offset.value = (offset.value + change) % NUMBER_OF_BUTTONS
    totalOffset.value = totalOffset.value + change

    selectedIndex.value = getAdjustedIndex((INITIAL_INDEX + offset.value) % NUMBER_OF_BUTTONS)

    // === Settle Carousel === //
    const endX = totalTranslationX.value + displacement
    const endPosition = calculateClosestCardPosition(endX)
    translationX.value = withTiming(endPosition, { duration: SETTLE_DURATION })
    totalTranslationX.value = endPosition

    // === Settle Wheel === //
    const angle = calculateRotationAngle(displacement)
    const endAngle = calculateClosestSegmentAngle(totalRotation.value + angle)
    totalRotation.value = endAngle
    rotationAngle.value = withTiming(endAngle, { duration: SETTLE_DURATION }, () => {
      // === Spring Scale === //
      selectedScale.value = withSpring(
        SELECTED_SCALE,
        SPRING_CONFIG,
        // === Finished - Update state === //
        (finished) => {
          if (finished) {
            disabled.value = false
            runOnJS(handleInfiniteData)(change)
            runOnJS(setIsDragging)(false)
          }
        },
      )
    })
  }

  const carouselPanGesture = Gesture.Pan()
    .onStart(handlePanStart)
    .onUpdate((event) => {
      handlePanUpdate(event.translationX)
    })
    .onEnd((event) => {
      handlePanEnd(event.translationX)
    })

  const wheelPanGesture = Gesture.Pan()
    .onStart(handlePanStart)
    .onUpdate((event) => {
      handlePanUpdate(-event.translationY * SCROLL_SPEED_MULTIPLIER)
    })
    .onEnd((event) => {
      handlePanEnd(-event.translationY * SCROLL_SPEED_MULTIPLIER)
    })

  // ================ Wheel Style ================ //
  const wheelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationAngle.value}rad` }],
      width: diameter,
      height: diameter,
    }
  })

  return (
    <DayScrollContext.Provider
      value={{
        state,
        data,
        selectedItem,
        constants,
        selectedIndex,
        onBodyLayout,
        isDragging,
        // Carousel
        carouselPanGesture,
        translationX,
        offset,
        totalOffset,
        selectedScale,
        // Wheel
        calculateButtonPosition,
        wheelPanGesture,
        wheelAnimatedStyle,
        rotationAngle,
        diameter,
        visible,
        // Modal
        dayModalVisible,
        toggleDayModal,
      }}
    >
      {children}
    </DayScrollContext.Provider>
  )
}

export const useDayScroll = () => {
  return React.useContext(DayScrollContext)
}

function reorderData(array: DayData[], offset = 0) {
  const reorder = _.chunk(array, array.length / 2).flat()

  if (offset < 0) {
    return [
      ..._.takeRight(reorder, array.length - Math.abs(offset)),
      ..._.take(reorder, Math.abs(offset)),
    ]
  }

  return [..._.takeRight(reorder, offset), ..._.take(reorder, array.length - offset)]
}
