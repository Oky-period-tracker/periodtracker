import * as React from 'react'
import { StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { State, PanGestureHandler } from 'react-native-gesture-handler'
import { onGestureEvent, preserveOffset, runSpring, snapPoint } from 'react-native-redash'

const {
  Clock,
  Value,
  useCode,
  set,
  divide,
  diff,
  sub,
  block,
  eq,
  cond,
  floor,
  ceil,
  not,
  clockRunning,
  stopClock,
  multiply,
  and,
} = Animated

const springConfig = {
  toValue: new Value(0),
  damping: 15,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
}

export function PanGesture({ absoluteIndex, ratio, isActive, isX, children = null }) {
  const clock = new Clock()
  const shouldSnap = new Value(0)
  const translationY = new Value(0)

  const velocityY = new Value(0)
  const translationX = new Value(0)
  const velocityX = new Value(0)

  const state = new Value(State.UNDETERMINED)
  const gestureEvent = onGestureEvent({
    translationY,
    velocityY,
    translationX,
    velocityX,
    state,
  })

  const translate = isX
    ? preserveOffset(translationX, state)
    : preserveOffset(multiply(translationY, new Value(-1)), state) // Added inversion to the y translate (multiply multiplies 2 animated Values together)

  const increment = divide(diff(translate), ratio)
  const velocity = isX ? velocityX : velocityY

  useCode(
    block([
      set(absoluteIndex, sub(absoluteIndex, increment)),
      cond(and(eq(state, State.BEGAN), eq(shouldSnap, 1)), [
        stopClock(clock),
        set(isActive, 0),
        set(shouldSnap, 0),
      ]),
      cond(eq(state, State.BEGAN), [stopClock(clock), set(isActive, 1)]),
      cond(eq(state, State.END), [set(state, State.UNDETERMINED), set(shouldSnap, 1)]),
      cond(eq(shouldSnap, 1), [
        set(
          absoluteIndex,
          runSpring(
            clock,
            absoluteIndex,
            snapPoint(absoluteIndex, divide(velocity, -ratio), [
              ceil(absoluteIndex),
              floor(absoluteIndex),
            ]),
            springConfig,
          ),
        ),
        cond(not(clockRunning(clock)), [set(shouldSnap, 0), set(isActive, 0)]),
      ]),
    ]),
    [],
  )

  return (
    <PanGestureHandler {...gestureEvent} minDist={15} {...children}>
      <Animated.View style={StyleSheet.absoluteFillObject}>{children}</Animated.View>
    </PanGestureHandler>
  )
}
