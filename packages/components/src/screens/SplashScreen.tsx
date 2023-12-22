import React from 'react'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { PageContainer } from '../components/layout/PageContainer'
import { assets } from '../assets/index'
import styled from 'styled-components/native'
import { useSelector, useDispatch } from 'react-redux'
import * as selectors from '../redux/common/selectors'
import * as actions from '../redux/common/actions'
import { navigateAndReset } from '../services/navigationService'
import { Animated, Easing } from 'react-native'
import { createNotificationChannel, requestUserPermission } from '../services/notifications'
import analytics from '@react-native-firebase/analytics'
import DeviceInfo from 'react-native-device-info'
import { useAlert } from '../components/context/AlertContext'
import { httpClient } from '../services/HttpClient'
import { fetchNetworkConnectionStatus } from '../services/network'
import messaging from '@react-native-firebase/messaging'

export function SplashScreen() {
  const dispatch = useDispatch()
  const user: any = useSelector(selectors.currentUserSelector)
  const Alert = useAlert()

  const locale = useSelector(selectors.currentLocaleSelector)
  const hasOpened = useSelector(selectors.hasOpenedSelector)
  const currentAppVersion = useSelector(selectors.currentAppVersion)
  const currentFirebaseToken = useSelector(selectors.currentFirebaseToken)
  const hasPasswordRequestOn = useSelector(selectors.isLoginPasswordActiveSelector)
  const [animatedValue] = React.useState(new Animated.Value(0))

  async function checkForPermanentAlerts() {
    const versionName = DeviceInfo.getVersion()
    try {
      const { message = '', isPermanent = false } = await httpClient.getPermanentAlert(
        versionName,
        locale,
        user,
      )
      if (message !== '') {
        Alert.showDissolveAlert(message, isPermanent)
      }
    } catch {
      // do nothing
    }
  }

  React.useEffect(() => {
    if (fetchNetworkConnectionStatus()) {
      analytics().logEvent('app_open', { user })
    }
    checkForPermanentAlerts()
    requestUserPermission()
    createNotificationChannel()
    // TODO_ALEX dynamic locale names for all?
    messaging().unsubscribeFromTopic('oky_en_notifications')
    messaging().unsubscribeFromTopic('oky_id_notifications')
    messaging().unsubscribeFromTopic('oky_mn_notifications')
    messaging().subscribeToTopic(`oky_${locale}_notifications`)
    if (currentAppVersion !== DeviceInfo.getVersion()) {
      dispatch(actions.setUpdatedVersion())
      dispatch(actions.updateFuturePrediction(true, null))
    }
    if (fetchNetworkConnectionStatus()) {
      if (currentFirebaseToken === null) {
        dispatch(actions.requestStoreFirebaseKey())
      }
    }

    Spin()
    requestAnimationFrame(() => {
      if (!hasOpened) {
        navigateAndReset('OnboardingScreen', null)
        return
      }
      if (user) {
        if (hasPasswordRequestOn) {
          navigateAndReset('PasswordRequestScreen', null)
          return
        }
        navigateAndReset('MainStack', null)
        return
      }
      navigateAndReset('LoginStack', null)
    })

    return () => {
      animatedValue.stopAnimation()
    }
  }, [])

  const Spin = () => {
    Animated.timing(animatedValue, {
      duration: 50000,
      toValue: 36000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }

  const rotation = animatedValue.interpolate({
    inputRange: [0, 36000],
    outputRange: ['0deg', '36000deg'],
  })

  return (
    <BackgroundTheme>
      <PageContainer>
        <Container>
          <Face resizeMode="contain" source={assets.static.spin_load_face} />
          <AnimatedContainer
            style={{
              transform: [{ rotate: rotation }],
            }}
          >
            <Spinner resizeMode="contain" source={assets.static.spin_load_circle} />
          </AnimatedContainer>
        </Container>
      </PageContainer>
    </BackgroundTheme>
  )
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const Face = styled.Image`
  height: 120px;
  width: 120px;
  align-self: center;
`
const Spinner = styled.Image`
  height: 123px;
  width: 123px;
`

const AnimatedContainer = styled(Animated.View)`
  height: 123px;
  width: 123px;
  position: absolute;
  align-self: center;
`
