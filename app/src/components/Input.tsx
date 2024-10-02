import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { Text } from './Text'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { ErrorText } from './ErrorText'
import { useTranslate } from '../hooks/useTranslate'
import { useColor } from '../hooks/useColor'

export type InputProps = TextInputProps & {
  style?: StyleProp<ViewStyle>
  inputStyle?: TextInputProps['style']
  errors?: string[]
  errorKeys?: string[]
  errorsVisible?: boolean
  displayOnly?: boolean
  actionLeft?: React.ReactNode
  actionRight?: React.ReactNode
}

export const Input = ({
  value,
  placeholder,
  style,
  inputStyle,
  errors,
  errorKeys,
  errorsVisible,
  displayOnly = false,
  actionLeft,
  actionRight,
  ...props
}: InputProps) => {
  const translate = useTranslate()
  const { palette, inputBackgroundColor, color, placeholderTextColor } = useColor()
  const placeholderText = translate(placeholder || '')

  const ref = React.useRef<TextInput>(null)

  const onPress = () => {
    if (ref.current) {
      ref.current.focus()
    }
  }

  const activeErrorKeys = errorKeys?.reduce<string[]>((acc, errorKey) => {
    if (errors?.includes(errorKey)) {
      return [...acc, errorKey]
    }
    return acc
  }, [])

  const errorKey = activeErrorKeys?.[0]
  const hasError = errorsVisible && errorKey

  return (
    <>
      {hasError && <ErrorText>{errorKey}</ErrorText>}
      <TouchableOpacity
        onPress={onPress}
        disabled={displayOnly || !props.multiline}
        activeOpacity={1}
        style={[
          styles.container,
          { backgroundColor: inputBackgroundColor },
          props.multiline && styles.multiline,
          style,
        ]}
      >
        <View style={styles.wrapper}>
          <View style={styles.sideComponent}>{actionLeft}</View>
          {displayOnly ? (
            <Text
              style={[styles.input, !value && { color: placeholderTextColor }]}
              enableTranslate={false}
            >
              {value || placeholderText}
            </Text>
          ) : (
            <>
              {!value && (
                // Separate from <TextInput> so that the cursor is centered
                <Text
                  style={[styles.placeholder, { color: placeholderTextColor }]}
                  enableTranslate={false}
                >
                  {placeholderText}
                </Text>
              )}
              <TextInput
                {...props}
                ref={ref}
                value={value}
                style={[styles.input, { color }, inputStyle]}
                autoCorrect={false}
              />
            </>
          )}
          <View style={styles.sideComponent}>
            {actionRight}
            {hasError && <FontAwesome size={16} name={'close'} color={palette.danger.text} />}
          </View>
        </View>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    textAlign: 'center',
    // @ts-expect-error TODO
    outlineStyle: 'none', // Web
  },
  sideComponent: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  multiline: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  placeholder: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    textAlign: 'center',
  },
})
