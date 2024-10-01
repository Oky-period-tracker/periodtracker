import React from 'react'
import { StyleSheet, TextStyle, TouchableOpacity, ViewProps } from 'react-native'
import { Text } from './Text'
import { SvgIconProps } from './icons/types'
import Cloud from './icons/Cloud'
import { useSelector } from 'react-redux'
import { currentThemeSelector } from '../redux/selectors'
import { IconForTheme } from '../resources/translations'
import { useColor } from '../hooks/useColor'

export type Appearance = 'fill' | 'outline'

export type IconButtonProps = SvgIconProps & {
  appearance?: Appearance
  onPress?: () => void
  text?: string
  textStyle?: TextStyle
  disabled?: boolean
  accessibilityLabel?: ViewProps['accessibilityLabel']
}

export const IconButton = ({
  appearance = 'fill',
  status = 'neutral',
  style,
  text,
  textStyle,
  size = 80,
  onPress,
  disabled,
  accessibilityLabel,
}: IconButtonProps) => {
  const { palette } = useColor()
  const theme = useSelector(currentThemeSelector)
  const Icon = IconForTheme?.[theme]?.[appearance] ?? Cloud

  return (
    <TouchableOpacity
      style={[styles.button, { width: size, height: size }, style]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
    >
      <Icon status={status} style={styles.icon} />
      <Text
        style={[
          styles.text,
          textStyle,
          appearance === 'outline' && { color: palette[status].base },
        ]}
        enableTranslate={false}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  text: {
    width: '60%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: 8,
    color: '#fff',
  },
})
