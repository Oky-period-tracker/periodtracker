import React from 'react'
import { assets } from '../../assets/index'
import styled from 'styled-components/native'
import { TextWithoutTranslation } from './Text'

// @TODO: provide the rights interface
interface Props {
  isActive?: any
  onPress?: any
  emoji?: any
  style?: any
  maskStyle?: any
  isTextVisible?: any
  numberOfLines?: number
  emojiStyle?: any
  textStyle?: any
  title?: any
  color?: any
  disabled?: boolean
}

export const EmojiSelector = React.memo<Props>(
  ({
    isActive = false,
    onPress = null,
    emoji,
    style = null,
    maskStyle = null,
    isTextVisible = true,
    disabled = false,
    numberOfLines = 1,
    emojiStyle,
    textStyle,
    title,
    color,
  }) => {
    return (
      <Container
        disabled={disabled}
        onPress={onPress}
        style={{
          ...style,
          height: undefined, // Prevent text height being limited by the height of the emoji
        }}
      >
        <Mask
          color={color}
          isActive={isActive}
          style={maskStyle}
          resizeMode="contain"
          source={assets.static.icons.roundedMask}
          size={style.height}
        >
          <Emoji style={emojiStyle}>{emoji}</Emoji>
        </Mask>
        {isTextVisible && (
          <EmojiText numberOfLines={numberOfLines} style={textStyle}>
            {title}
          </EmojiText>
        )}
      </Container>
    )
  },
)

const Container = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-bottom: 14;
`

const Emoji = styled.Text`
  font-size: 18;
  text-align: center;
  color: #ffffff;
`

const EmojiText = styled(TextWithoutTranslation)`
  font-size: 10;
  width: 120%;
  align-self: center;
  text-align: center;
  color: #000;
`
const Mask = styled.ImageBackground<{ isActive: boolean; color: string; size: number }>`
  width: ${(props) => (props.size ? props.size : 10)};
  height: ${(props) => (props.size ? props.size : 10)};
  border-radius: ${(props) => (props.size ? props.size / 2 : 10)};
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isActive ? props.color : '#EAEAEA')};
`
