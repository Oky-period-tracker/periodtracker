import React from 'react'
import styled from 'styled-components/native'
import { Text } from './Text'
import { Icon } from './Icon'
import { assets } from '../../assets'
import { ThemedModal } from './ThemedModal'
import { getAccessibilityLabel } from '../../services/textToSpeech'
import { ImageProps, ViewProps } from 'react-native'

export const SurveyInformationButton = ({
  onPress,
  style,
  icon = assets.static.icons.infoPink,
  iconStyle,
}: {
  onPress?: () => void
  style?: ViewProps['style']
  icon?: ImageProps['source']
  iconStyle?: ImageProps['style']
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  return (
    <>
      <TouchableArea
        style={style}
        accessibilityLabel={getAccessibilityLabel('Information button')}
        onPress={() => {
          onPress ? onPress() : setIsVisible(true)
        }}
      >
        <Icon style={iconStyle} source={icon} />
      </TouchableArea>
      <ThemedModal {...{ isVisible, setIsVisible }}>
        <CardPicker>
          <Heading>survey</Heading>
          <TextContent>info_button_survey</TextContent>
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
