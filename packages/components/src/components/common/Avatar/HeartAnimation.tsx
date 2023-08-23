import React from 'react'
import { View, Animated, StyleSheet, Image, Platform } from 'react-native'
import { assets } from '../../../assets/index'

export function HeartAnimation({ count }) {
  const [hearts, setHearts] = React.useState([])
  const [height] = React.useState(200)
  const oldCount = React.useRef(0)
  const heartId = React.useRef(0)
  function createHeart(index) {
    return {
      id: index,
      left: getRandomNumber(0, 50),
    }
  }

  function removeHeart(id) {
    setHearts(heartsCurrent => heartsCurrent.filter(heart => heart.id !== id))
  }

  React.useEffect(() => {
    const newCount = count
    const numHearts = newCount - oldCount.current
    if (numHearts <= 0) {
      return
    }
    const items = Array(numHearts).fill(0)
    heartId.current = heartId.current + 1
    const newHearts = items.map(() => heartId.current).map(createHeart)
    oldCount.current = count
    setHearts(heartsCurrent => heartsCurrent.concat(newHearts))
  }, [count])

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {hearts.map(({ id, left }) => (
        <AnimatedShape key={id} height={height} style={{ left }} onComplete={() => removeHeart(id)}>
          <Image source={assets.static.icons.heart.full} style={{ height: 30, width: 30 }} />
        </AnimatedShape>
      ))}
    </View>
  )
}

function AnimatedShape({ height, onComplete, children, style }) {
  const [position] = React.useState(new Animated.Value(0))
  const [animationsReady, setAnimationsReady] = React.useState(false)

  const xAnimation: any = React.useRef()
  const yAnimation: any = React.useRef()
  const scaleAnimation: any = React.useRef()
  const rotateAnimation: any = React.useRef()
  const opacityAnimation: any = React.useRef()

  React.useEffect(() => {
    Animated.timing(position, {
      duration: 1500,
      useNativeDriver: true,
      toValue: height * -1,
    }).start(onComplete)
  }, [])

  function getAnimationStyle() {
    if (!animationsReady) {
      return { opacity: 0 }
    }

    return {
      transform: [
        { translateY: position },
        { translateX: xAnimation.current },
        { scale: scaleAnimation.current },
        { rotate: rotateAnimation.current },
      ],
      opacity: opacityAnimation.current,
    }
  }

  const handleOnLayout = e => {
    const negativeHeight = height * -1
    const shapeHeight = e.nativeEvent.layout.height

    yAnimation.current = position.interpolate({
      inputRange: [negativeHeight, 0],
      outputRange: [height, 0],
    })

    opacityAnimation.current = yAnimation.current.interpolate({
      inputRange: [0, height - shapeHeight],
      outputRange: [1, 0],
    })

    scaleAnimation.current = yAnimation.current.interpolate({
      inputRange: [0, 15, 30, height],
      outputRange: [0, 1.2, 1, 1],
    })

    xAnimation.current = yAnimation.current.interpolate({
      inputRange: [0, height / 2, height],
      outputRange: [0, 15, 0],
    })

    rotateAnimation.current = yAnimation.current.interpolate({
      inputRange: [0, height / 4, height / 3, height / 2, height],
      outputRange: ['0deg', '-2deg', '0deg', '2deg', '0deg'],
    })

    setTimeout(() => setAnimationsReady(true), 400)
  }

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'transparent',
        },
        getAnimationStyle(),
        style,
      ]}
      onLayout={handleOnLayout}
    >
      {children}
    </Animated.View>
  )
}

const getRandomNumber = (min, max) => Math.random() * (max - min) + min
