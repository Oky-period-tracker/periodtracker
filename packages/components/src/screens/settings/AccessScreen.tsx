import React from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { BackgroundTheme } from '../../components/layout/BackgroundTheme'
import styled from 'styled-components/native'
import { ListItem } from './accessScreen/ListItem'
import { Header } from '../../components/common/Header'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'
import * as actions from '../../redux/actions/index'
import { useDispatch } from 'react-redux'
import { navigateAndReset } from '../../services/navigationService'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../components/common/Text'
import Share from 'react-native-share'
import { translate } from '../../i18n'
import { SpinLoader } from '../../components/common/SpinLoader'
import { LanguageSelect } from '../../components/common/LanguageSelect'
import { useTextToSpeechHook } from '../../hooks/useTextToSpeechHook'
import { acessSettingsScreenText, WEBSITE_URL } from '../../config'
import { hapticAndSoundFeedback } from '../../services/tonefeedback'

export function AccessScreen({ navigation }) {
  const locale = useSelector(selectors.currentLocaleSelector)
  const dispatch = useDispatch()
  const [loading, setLoading] = React.useState(false)

  const privacyContent = useSelector(selectors.privacyContent)
  const speechText = privacyContent.map((item) => item.content)
  const shareLink = () => {
    // @TODO: app event
    dispatch(actions.shareApp())
    const options = {
      url: WEBSITE_URL,
      message: translate('join_oky_message'),
    }
    Share.open(options)
      .then((res) => null)
      .catch((err) => null)
  }
  // useTextToSpeechHook({ navigation, text: speechText })
  useTextToSpeechHook({
    navigation,
    text: acessSettingsScreenText(),
  })

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="access_setting" />
        <Container>
          <ListItem
            title="language"
            subtitle="language_subtitle"
            renderControls={() => (
              <LanguageSelect
                onPress={(lang) => {
                  if (lang !== locale) {
                    setLoading(true)
                    requestAnimationFrame(() => {
                      dispatch(actions.setLocale(lang))
                    })
                  }
                }}
                textStyle={styles.languageButtonText}
                style={styles.languageButton}
              />
            )}
          />
          <ListItem
            title="tutorial"
            subtitle="tutorial_subtitle"
            renderControls={() => (
              <ShareButton
                onPressIn={() => hapticAndSoundFeedback('general')}
                onPress={() => {
                  setLoading(true)
                  requestAnimationFrame(() => {
                    navigateAndReset('TutorialSecondStack', null)
                  })
                }}
              >
                <ShareButtonText>launch</ShareButtonText>
              </ShareButton>
            )}
          />
          <ListItem
            title="share"
            subtitle="share_qr_description"
            style={styles.lastItem}
            innerStyle={styles.lastItemInner}
            renderControls={() => (
              <ShareButton
                onPressIn={() => hapticAndSoundFeedback('general')}
                onPress={() => shareLink()}
              >
                <ShareButtonText>share_setting</ShareButtonText>
              </ShareButton>
            )}
          />
          <Empty />
        </Container>
      </PageContainer>
      <SpinLoader isVisible={loading} setIsVisible={setLoading} />
    </BackgroundTheme>
  )
}

const Container = styled.View`
  border-radius: 10px;
  elevation: 3;
  background: #fff;
  margin-horizontal: 2px;
  margin-bottom: 30px;
`

const Empty = styled.View`
  flex: 1;
`

const ShareButtonText = styled(Text)`
  font-size: 16;
  font-style: normal;
  color: #fff;
`

const ShareButton = styled(TouchableOpacity)`
  height: 55px;
  width: 100px;
  align-self: center;
  margin-top: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: #a2c72d;
`

const styles = StyleSheet.create({
  languageButton: {
    height: 55,
    width: 100,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a2c72d',
  },
  languageButtonText: {
    fontSize: 16,
    fontStyle: 'normal',
    color: '#fff',
  },
  lastItem: {
    paddingBottom: 10,
  },
  lastItemInner: {
    borderBottomWidth: 0,
  },
})
