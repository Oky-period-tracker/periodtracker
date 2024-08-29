import React, { useCallback } from 'react'
import { LayoutChangeEvent, View, ViewProps } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { reactNodeExists } from '../services/utils'

const AnimatedContainer = ({ style, children }: ViewProps) => {
  // Conditional render required to prevent bug
  if (!reactNodeExists(children)) {
    return null
  }

  return <AnimatedContainerBase style={style}>{children}</AnimatedContainerBase>
}

const AnimatedContainerBase = ({ style, children }: ViewProps) => {
  const height = useSharedValue(1)

  const onContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const newHeight = event.nativeEvent.layout.height
      height.value = withTiming(newHeight, { duration: 350 })
    },
    [children],
  )

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      overflow: 'hidden',
    }
  })

  return (
    <Animated.View style={[animatedStyle, style]}>
      <View onLayout={onContentLayout}>{children}</View>
    </Animated.View>
  )
}

export default AnimatedContainer
