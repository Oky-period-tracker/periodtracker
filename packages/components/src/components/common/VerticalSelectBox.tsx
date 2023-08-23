import React from 'react'
import styled from 'styled-components/native'
import { Animated, TouchableOpacity } from 'react-native'
import { Icon } from './Icon'
import { assets } from '../../assets/index'
import { Text } from './Text'
import { IconButton } from './buttons/IconButton'
import { ThemedModal } from './ThemedModal'

export const VerticalSelectBox = ({
  items,
  onValueChange,
  hasError = false,
  containerStyle = null,
  itemStyle = null,
  height = 45,
  buttonStyle = null,
  maxLength = 20,
  errorHeading = 'none',
  errorContent = 'none',
}) => {
  const [position] = React.useState(new Animated.Value(0))
  const [isStateOne, setIsStateOne] = React.useState(true)
  const [i, setI] = React.useState(0)
  const [j, setJ] = React.useState(1)
  const [positionNext] = React.useState(new Animated.Value(0))
  const [isEnabled, setIsEnabled] = React.useState(true)
  const [isVisible, setIsVisible] = React.useState(false)

  const Animate = () => {
    setIsEnabled(false)
    Animated.sequence([
      Animated.parallel([
        Animated.timing(position, {
          duration: 500,
          useNativeDriver: true,
          toValue: isStateOne ? -height : 0,
        }),
        Animated.timing(positionNext, {
          duration: 500,
          useNativeDriver: true,
          toValue: isStateOne ? -height : -2 * height,
        }),
      ]),
      Animated.timing(isStateOne ? position : positionNext, {
        toValue: isStateOne ? height : 0,
        useNativeDriver: true,
        duration: 0,
      }),
    ]).start(() => {
      setIsEnabled(true)
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
    <>
      <FormControl style={{ height, ...containerStyle }}>
        <Row disabled={!isEnabled} onPress={() => Animate()} style={{ height, overflow: 'hidden' }}>
          <Animated.View
            style={{
              height,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ translateY: position }],
            }}
          >
            <SelectedItem style={[itemStyle, i === 0 ? { color: '#28b9cb' } : { color: '#555' }]}>
              {items[i] === ''
                ? ''
                : items[i].length > maxLength
                ? items[i].substring(0, maxLength - 3) + '...'
                : items[i]}
            </SelectedItem>
          </Animated.View>
          <Animated.View
            style={{
              height,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ translateY: positionNext }],
            }}
          >
            <SelectedItem style={[itemStyle, j === 0 ? { color: '#28b9cb' } : { color: '#555' }]}>
              {items[j] === ''
                ? ''
                : items[j].length > maxLength
                ? items[j].substring(0, maxLength - 3) + '...'
                : items[j]}
            </SelectedItem>
          </Animated.View>
        </Row>
        {hasError && (
          <TouchableOpacity
            style={{
              height: '90%',
              aspectRatio: 1,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 5,
              zIndex: 999,
              bottom: '5%',
            }}
            onPress={() => setIsVisible(true)}
          >
            <Icon style={{ height: 25, aspectRatio: 1 }} source={assets.static.icons.infoPink} />
          </TouchableOpacity>
        )}
        <AbsolutePositioner style={[buttonStyle, buttonStyle]}>
          <IconButton
            disabled={!isEnabled}
            style={{ transform: [{ rotate: '-90deg' }] }}
            onPress={() => Animate()}
            name="switch"
          />
        </AbsolutePositioner>
      </FormControl>
      <ThemedModal {...{ isVisible, setIsVisible }}>
        <CardPicker>
          <Heading>{errorHeading}</Heading>
          <TextContent>{errorContent}</TextContent>
        </CardPicker>
      </ThemedModal>
    </>
  )
}

const FormControl = styled.View`
  width: 100%;
  background-color: #efefef;
`

const Row = styled.TouchableOpacity`
  width: 100%;
  flex-direction: column;
`
const AbsolutePositioner = styled.View`
  position: absolute;
  right: -40;
  bottom: 5;
`

const SelectedItem = styled(Text)`
  justify-content: center;
  font-family: Roboto-Regular;
  text-align: center;
  font-size: 15;
`
const CardPicker = styled.View`
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15;
  padding-horizontal: 15;
`

const Heading = styled(Text)`
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10;
  color: #a2c72d;
`

const TextContent = styled(Text)`
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10;
`
