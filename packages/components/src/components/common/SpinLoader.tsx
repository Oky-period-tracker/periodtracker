import React from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'
import { ThemedModal } from './ThemedModal'
import { assets } from '../../assets'
import { Text } from './Text'

export const SpinLoader = ({ isVisible, setIsVisible, text = 'empty', backdropOpacity = 0.8 }) => {
  const [animatedValue] = React.useState(new Animated.Value(0))

  const onModalWillShow = () => {
    Spin()
  }

  const Spin = () => {
    Animated.timing(animatedValue, {
      duration: 50000,
      toValue: 36000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }

  const rotation = animatedValue.interpolate({
    inputRange: [0, 36000],
    outputRange: ['0deg', '36000deg'],
  })

  return (
    <ThemedModal
      {...{
        isVisible,
        setIsVisible,
        backdropOpacity,
        animationIn: 'fadeIn',
        animationOut: 'fadeOut',
        onBackdropPress: () => null,
        onModalWillShow,
        onModalHide: () => animatedValue.stopAnimation(),
        includeCloseButton: false,
      }}
    >
      <TutorialText>{text}</TutorialText>
      <Face resizeMode="contain" source={assets.static.spin_load_face} />
      <Container
        style={{
          transform: [{ rotate: rotation }],
        }}
      >
        <Spinner resizeMode="contain" source={assets.static.spin_load_circle} />
      </Container>
    </ThemedModal>
  )
}

const Face = styled.Image`
  height: 120px;
  width: 120px;

  align-self: center;
`
const Spinner = styled.Image`
  height: 123px;
  width: 123px;
`

const Container = styled(Animated.View)`
  height: 123px;
  width: 123px;
  position: absolute;
  align-self: center;
`

const TutorialText = styled(Text)`
  width: 70%;
  color: #f49200;
  align-self: center;
  font-size: 20;
  font-family: Roboto-Black;
  top: 20%;
  text-align: center;
  position: absolute;
`
