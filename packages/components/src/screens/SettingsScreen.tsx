import React from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import styled from 'styled-components/native'
import { ListItem } from '../components/common/ListItem'
import { Header } from '../components/common/Header'
import { PrimaryButton } from '../components/common/buttons/PrimaryButton'
import { Switcher } from './settings/Switcher'
import { navigate } from '../services/navigationService'
import { useDispatch } from 'react-redux'
import { commonActions } from '../redux/common/actions'
import { ConfirmAlert } from '../components/common/ConfirmAlert'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/common/selectors'
import { translate } from '../i18n/index'
import { SpinLoader } from '../components/common/SpinLoader'
import { settingsScreenText } from '../config'
import { useTextToSpeechHook } from '../hooks/useTextToSpeechHook'
import { closeOutTTs } from '../services/textToSpeech'
import analytics from '@react-native-firebase/analytics'
import { fetchNetworkConnectionStatus } from '../services/network'
import { useTodayPrediction } from '../components/context/PredictionProvider'

export function SettingsScreen({ navigation }) {
  const dispatch = useDispatch()
  const [loading, setLoading] = React.useState(false)
  const currentCycleInfo = useTodayPrediction()
  const currentUser = useSelector(selectors.currentUserSelector)
  const hasTtsActive = useSelector(selectors.isTtsActiveSelector)
  const hasFuturePredictionActive = useSelector(selectors.isFuturePredictionSelector)

  useTextToSpeechHook({
    navigation,
    text: settingsScreenText({ hasTtsActive }),
  })

  return (
    <BackgroundTheme>
      <ScrollContainer>
        <Header showGoBackButton={false} screenTitle="settings" />
        <Container>
          <NavigationLink onPress={() => navigate('AboutScreen', null)}>
            <ListItem title="about" description="about_info" />
          </NavigationLink>
          <NavigationLink onPress={() => navigate('TermsScreen', null)}>
            <ListItem title="t_and_c" description="t_and_c_info" />
          </NavigationLink>
          <NavigationLink onPress={() => navigate('PrivacyScreen', null)}>
            <ListItem title="privacy_policy" description="privacy_info" />
          </NavigationLink>
          <NavigationLink onPress={() => navigate('AccessScreen', null)}>
            <ListItem title="access_setting" description="settings_info" />
          </NavigationLink>
          {/* <ListItem
            title="text_to_speech"
            description="text_to_speech_info"
            renderControls={() => (
              <Switcher
                value={hasTtsActive}
                onSwitch={(val) => {
                  if (val) {
                    if (fetchNetworkConnectionStatus()) {
                      analytics().logEvent('enable_text_to_speech', { user: currentUser })
                    }
                  }
                  closeOutTTs()
                  dispatch(commonActions.setTtsActive(val))
                }}
              />
            )}
          /> */}
          <ListItem
            title="future_prediciton"
            description="future_prediciton_info"
            renderControls={() => (
              <Switcher
                value={hasFuturePredictionActive?.futurePredictionStatus}
                onSwitch={(val) => {
                  const currentStartDate = currentCycleInfo
                  dispatch(commonActions.updateFuturePrediction(val, currentStartDate))
                }}
              />
            )}
          />
        </Container>
        <Row style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <PrimaryButton
            textStyle={{ color: 'white' }}
            style={{ flex: 1, backgroundColor: '#f49200', marginRight: 5 }}
            onPress={() =>
              ConfirmAlert(
                translate('are_you_sure'),
                translate('logout_account_description'),
                () => {
                  setLoading(true)
                  setTimeout(() => {
                    dispatch(commonActions.logoutRequest())
                  }, 100)
                },
              )
            }
          >
            logout
          </PrimaryButton>
          <PrimaryButton
            style={{ flex: 1, backgroundColor: '#EFEFEF' }}
            onPress={() => {
              ConfirmAlert(
                translate('are_you_sure'),
                translate('delete_account_description'),
                () => {
                  setTimeout(() => {
                    if (fetchNetworkConnectionStatus()) {
                      analytics().logEvent('delete_account', { user: currentUser })
                    }
                    dispatch(
                      commonActions.deleteAccountRequest({
                        name: currentUser.name,
                        password: currentUser.password,
                        setLoading,
                      }),
                    )
                  }, 100)
                },
              )
            }}
          >
            delete_account_button
          </PrimaryButton>
          <PrimaryButton
            style={{ flex: 1, marginLeft: 5, backgroundColor: '#a2c72d' }}
            textStyle={{ color: 'white' }}
            onPress={() => navigate('ContactUsScreen', null)}
          >
            contact_us
          </PrimaryButton>
        </Row>
      </ScrollContainer>
      <SpinLoader isVisible={loading} setIsVisible={setLoading} />
    </BackgroundTheme>
  )
}

const ScrollContainer = styled.View`
  height: 100%;
  width: 100%;
  padding-horizontal: 10px;
`

const Container = styled.View`
  height: 75%;
  border-radius: 10px;
  elevation: 3;
  background: #fff;
  margin-horizontal: 2px;
`

const Row = styled.View`
  flex-direction: row;
`

const NavigationLink = styled.TouchableOpacity`
  flex: 1;
`

const Overlay = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`
