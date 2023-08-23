import React from 'react'
import styled from 'styled-components/native'
import { Text } from './Text'
import { Icon } from './Icon'
import { assets } from '../../assets'
import { ThemedModal } from './ThemedModal'

export const InformationButton = ({
  onPress = null,
  style = null,
  label = null,
  icon = assets.static.icons.infoPink,
  iconStyle = null,
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  return (
    <>
      <TouchableArea
        style={style}
        onPress={() => {
          onPress ? onPress() : setIsVisible(true)
        }}
      >
        <Icon style={iconStyle} source={icon} />
        {label && <TutorialLaunchLabel>{label}</TutorialLaunchLabel>}
      </TouchableArea>
      <ThemedModal {...{ isVisible, setIsVisible }}>
        <CardPicker>
          <Heading>fertile_popup_heading</Heading>
          <TextContent>fertile_popup</TextContent>
        </CardPicker>
      </ThemedModal>
    </>
  )
}

const TouchableArea = styled.TouchableOpacity`
  padding-vertical: 25;
`

const TutorialLaunchLabel = styled(Text)`
  color: white;
  font-size: 12;
  margin-left: 10;
  font-family: Roboto-Black;
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
