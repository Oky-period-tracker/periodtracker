import React from 'react'
import { Text as RNText } from 'react-native'
import { translate } from '../../i18n'

export function Text({ children, style = null, enableTranslate = true, ...props }) {
  return (
    <RNText style={[{ fontFamily: 'Roboto-Medium' }, style]} {...props}>
      {enableTranslate ? translate(children) : children}
    </RNText>
  )
}

export function TextWithoutTranslation(props) {
  const color = props?.color ? props.color : '#000'

  return <Text style={{ color }} enableTranslate={false} {...props} />
}
