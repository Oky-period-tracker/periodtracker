import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { AvatarSelect } from './avatarAndTheme/AvatarSelect'
import { ThemeSelect } from './avatarAndTheme/ThemeSelect'
import { PageContainer } from '../components/layout/PageContainer'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { PrimaryButton } from '../components/common/buttons/PrimaryButton'
import * as actions from '../redux/actions/index'
import { Header } from '../components/common/Header'
import { useTheme } from '../components/context/ThemeContext'
import { BackOneScreen, navigate } from '../services/navigationService'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import styled from 'styled-components/native'
import { Text } from '../components/common/Text'
import { ScrollView } from 'react-native-gesture-handler'
import { themeNames, avatarNames } from '@oky/core'

export function AvatarAndThemeScreen({ navigation }) {
  const signingUp = navigation.getParam('signingUp')
  const newUser = navigation.getParam('newUser')
  const [loading, setLoading] = React.useState(false)
  const selectedAvatar = useSelector(selectors.currentAvatarSelector)
  const dispatch = useDispatch()

  const { id } = useTheme()

  React.useEffect(() => {
    setLoading(false)
  }, [id])

  return (
    <BackgroundTheme>
      <PageContainer>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
          <Header
            screenTitle={signingUp ? 'empty' : 'avatar_amp_themes'}
            showGoBackButton={!signingUp}
          />
          {signingUp && <Text style={styles.text}>avatar_amp_themes_login</Text>}
          <AvatarSelect
            avatars={avatarNames}
            value={selectedAvatar}
            onSelect={(avatar) => dispatch(actions.setAvatar(avatar))}
          />
          <ThemeSelect
            themes={themeNames}
            value={useTheme().id}
            onSelect={(theme) => {
              if (theme !== id) {
                setLoading(true)
                requestAnimationFrame(() => {
                  dispatch(actions.setTheme(theme))
                })
              }
            }}
          />
          <ButtonContainer>
            <PrimaryButton
              style={styles.flex}
              onPress={() => (signingUp ? navigate('JourneyScreen', { newUser }) : BackOneScreen())}
            >
              confirm
            </PrimaryButton>
          </ButtonContainer>
          {loading && (
            <Overlay>
              <ActivityIndicator size="large" color="#f49200" />
            </Overlay>
          )}
        </ScrollView>
      </PageContainer>
    </BackgroundTheme>
  )
}

const Overlay = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  elevation: 6;
`

const ButtonContainer = styled.View`
  margin-top: 12px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const styles = StyleSheet.create({
  scrollView: { justifyContent: 'center' },
  text: {
    width: '80%',
    alignSelf: 'center',
    color: '#F49200',
    fontFamily: 'Roboto-Black',
    fontSize: 20,
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  flex: {
    flex: 1,
  },
})
