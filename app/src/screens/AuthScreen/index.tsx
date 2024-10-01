import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeScreen } from '../../components/Screen'
import { Button } from '../../components/Button'
import AnimatedContainer from '../../components/AnimatedContainer'
import { SignUp } from './components/SignUp'
import { AuthToggle } from './components/AuthToggle'
import { AuthModeProvider, useAuthMode } from './AuthModeContext'
import { ScreenProps } from '../../navigation/RootNavigator'
import { AvatarAndThemeSelect } from '../AvatarAndThemeScreen'
import { Welcome } from './components/Welcome'
import { Journey } from './components/Journey'
import { AuthLinks } from './components/AuthLinks'
import { LogIn } from './components/LogIn'
import { DeleteAccount } from './components/DeleteAccount'
import { ForgotPassword } from './components/ForgotPassword'
import { LanguageSelector } from '../../components/LanguageSelector'
import { useStopLoadingEffect } from '../../contexts/LoadingProvider'
import { AuthScreenHeader } from './components/AuthScreenHeader'
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'

const AuthScreen = (props: ScreenProps<'Auth'>) => {
  useStopLoadingEffect()

  return (
    <AuthModeProvider>
      <AuthScreenInner {...props} />
    </AuthModeProvider>
  )
}

const AuthScreenInner = ({ navigation }: ScreenProps<'Auth'>) => {
  const { backgroundColor } = useColor()
  const { authMode, setAuthMode } = useAuthMode()
  const goToInfo = () => navigation.navigate('Info')

  if (authMode === 'avatar_and_theme') {
    const onConfirm = () => setAuthMode('onboard_journey')
    return <AvatarAndThemeSelect onConfirm={onConfirm} />
  }

  if (authMode === 'welcome') {
    return <Welcome />
  }

  if (authMode === 'onboard_journey') {
    return <Journey />
  }

  return (
    <SafeScreen style={styles.screen}>
      {authMode === 'start' && <AuthScreenHeader />}

      <View style={[styles.wrapper, globalStyles.shadow]}>
        <AnimatedContainer style={[styles.container, { backgroundColor }, globalStyles.elevation]}>
          {authMode === 'start' && <AuthToggle />}
          {authMode === 'log_in' && <LogIn />}
          {authMode === 'sign_up' && <SignUp />}
          {authMode === 'forgot_password' && <ForgotPassword />}
          {authMode === 'delete_account' && <DeleteAccount />}
        </AnimatedContainer>
      </View>

      {authMode === 'start' && (
        <>
          <AuthLinks />
          <View style={styles.footer}>
            <Button status={'basic'} onPress={goToInfo}>
              info
            </Button>
            <LanguageSelector status={'basic'} />
          </View>
        </>
      )}
    </SafeScreen>
  )
}

export default AuthScreen

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 12,
  },
  wrapper: {
    width: '100%',
  },
  container: {
    borderRadius: 20,
    width: '100%',
    overflow: 'hidden',
    zIndex: 999,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 24,
    marginHorizontal: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})
