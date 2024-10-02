import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '../../components/Button'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { CustomStackNavigationOptions } from './NavigationStack'
import { IS_ANDROID } from '../../services/device'
import { Text } from '../../components/Text'
import { DateBadge } from '../../components/DateBadge'
import { useAccessibilityLabel } from '../../hooks/useAccessibilityLabel'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { useColor } from '../../hooks/useColor'

export type HeaderProps = NativeStackHeaderProps & {
  options: CustomStackNavigationOptions
}

export const Header = ({ navigation, options, route }: HeaderProps) => {
  // @ts-expect-error TODO:
  const date = route.params?.date // DayScreen
  const title = options.title
  const enableTranslate = !options?.disableTranslate
  const showBackButton = options.allowGoBack && navigation.canGoBack()
  const getAccessibilityLabel = useAccessibilityLabel()
  const label = getAccessibilityLabel('arrow_button')

  const { size } = useResponsive()
  const { palette } = useColor()

  const onBackPress = () => {
    navigation.goBack()
  }

  if (route.name === 'Home' && size === 's') {
    return <View style={styles.spacer} />
  }

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.container}>
        {showBackButton ? (
          <Button onPress={onBackPress} style={styles.button} accessibilityLabel={label}>
            <FontAwesome size={12} name={'arrow-left'} color={'#fff'} />
          </Button>
        ) : null}
        {date ? (
          <DateBadge date={date} style={styles.dateBadge} />
        ) : (
          <Text
            enableTranslate={enableTranslate}
            style={[styles.title, { color: palette.secondary.text }]}
          >
            {title}
          </Text>
        )}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 800,
    minHeight: 80,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: IS_ANDROID ? 20 : -20,
  },
  button: {
    width: 24,
    height: 24,
  },
  title: {
    flex: 1,
    fontSize: 26,
    textAlign: 'right',
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  dateBadge: {
    marginLeft: 'auto',
  },
  spacer: {
    height: 12,
  },
})
