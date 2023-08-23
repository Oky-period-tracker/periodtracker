import React from 'react'
import styled from 'styled-components/native'
import { Animated } from 'react-native'
import { Icon } from './Icon'
import { assets } from '../../assets/index'
import { Text } from './Text'
import { IconButton } from './buttons/IconButton'

export const SelectBox = ({
  items,
  onValueChange,
  title,
  hasError = false,
  isValid = false,
  containerStyle = null,
  itemStyle = null,
  width = 150,
  buttonStyle = null,
  maxLength = 20,
}) => {
  const [position] = React.useState(new Animated.Value(0))
  const [isStateOne, setIsStateOne] = React.useState(true)
  const [i, setI] = React.useState(0)
  const [j, setJ] = React.useState(1)
  const [positionNext] = React.useState(new Animated.Value(0))

  const Animate = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(position, {
          duration: 500,
          useNativeDriver: true,
          toValue: isStateOne ? -width : 0,
        }),
        Animated.timing(positionNext, {
          duration: 500,
          useNativeDriver: true,
          toValue: isStateOne ? -width : -2 * width,
        }),
      ]),
      Animated.timing(isStateOne ? position : positionNext, {
        toValue: isStateOne ? width : 0,
        useNativeDriver: true,
        duration: 0,
      }),
    ]).start(() => {
      isStateOne
        ? setI(() => {
            if (j + 1 > items.length - 1) {
              return 0
            }
            return j + 1
          })
        : setJ(() => {
            if (i + 1 > items.length - 1) {
              return 0
            }
            return i + 1
          })
      isStateOne ? onValueChange(items[j]) : onValueChange(items[i])
      setIsStateOne((val) => !val)
    })
  }

  return (
    <FormControl style={{ width, ...containerStyle }}>
      <Label>{title}</Label>
      <Row onPress={() => Animate()} style={{ overflow: 'hidden' }}>
        <Animated.View style={{ width, transform: [{ translateX: position }] }}>
          <SelectedItem style={itemStyle}>
            {items[i] === ''
              ? ''
              : items[i].length > maxLength
              ? items[i].substring(0, maxLength - 3) + '...'
              : items[i]}
          </SelectedItem>
        </Animated.View>
        <Animated.View style={{ width, transform: [{ translateX: positionNext }] }}>
          <SelectedItem style={itemStyle}>
            {items[j] === ''
              ? ''
              : items[j].length > maxLength
              ? items[j].substring(0, maxLength - 3) + '...'
              : items[j]}
          </SelectedItem>
        </Animated.View>
      </Row>
      {isValid && !hasError && (
        <Icon
          source={assets.static.icons.tick}
          style={{ position: 'absolute', right: -30, bottom: 5 }}
        />
      )}
      {hasError && (
        <Icon
          source={assets.static.icons.closeLine}
          style={{ position: 'absolute', right: -30, bottom: 5 }}
        />
      )}
      <Underline />
      <AbsolutePositioner style={buttonStyle}>
        <IconButton onPress={() => Animate()} name="switch" />
      </AbsolutePositioner>
    </FormControl>
  )
}

const FormControl = styled.View`
  width: 150;
`

const Row = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
`
const AbsolutePositioner = styled.View`
  position: absolute;
  right: -40;
  bottom: 5;
`

const Label = styled(Text)`
  width: 100%;
  color: #28b9cb;
  font-size: 12;
`

const Underline = styled.View`
  height: 1px;
  background: #eaeaea;
  width: 100%;
`

const SelectedItem = styled(Text)`
  height: 25px;
  width: 100%;
  font-size: 18;
  color: #555;
`
