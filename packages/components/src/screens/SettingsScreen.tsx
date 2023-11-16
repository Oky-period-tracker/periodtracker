import React from 'react'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import styled from 'styled-components/native'
import { ListItem } from '../components/common/ListItem'
import { Header } from '../components/common/Header'
import { PrimaryButton } from '../components/common/buttons/PrimaryButton'
import { Switcher } from './settings/Switcher'
import { navigate } from '../services/navigationService'
import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'
import { ConfirmAlert } from '../components/common/ConfirmAlert'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import { translate } from '../i18n/index'
import { SpinLoader } from '../components/common/SpinLoader'
import { settingsScreenText } from '../config'
import { useTextToSpeechHook } from '../hooks/useTextToSpeechHook'
import analytics from '@react-native-firebase/analytics'
import { fetchNetworkConnectionStatus } from '../services/network'
import { useTodayPrediction } from '../components/context/PredictionProvider'
import { StyleSheet } from 'react-native'

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
                  dispatch(actions.setTtsActive(val))
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
                  dispatch(actions.updateFuturePrediction(val, currentStartDate))
                }}
              />
            )}
          />
        </Container>
        <Row>
          <PrimaryButton
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
            onPress={() =>
              ConfirmAlert(
                translate('are_you_sure'),
                translate('logout_account_description'),
                () => {
                  setLoading(true)
                  setTimeout(() => {
                    dispatch(actions.logoutRequest())
                  }, 100)
                },
              )
            }
          >
            logout
          </PrimaryButton>
          <PrimaryButton
            style={styles.deleteAccountButton}
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
                      actions.deleteAccountRequest({
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
            style={styles.contactButton}
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
  justify-content: center;
  margin-top: 10px;
`

const NavigationLink = styled.TouchableOpacity`
  flex: 1;
`

const styles = StyleSheet.create({
  logoutButton: {
    flex: 1,
    backgroundColor: '#f49200',
    marginRight: 5,
  },
  logoutButtonText: {
    color: 'white',
  },
  deleteAccountButton: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  contactButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#a2c72d',
  },
})
