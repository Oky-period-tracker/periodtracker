import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components/native'
import { PageContainer } from '../components/layout/PageContainer'
import { Text, TextWithoutTranslation } from '../components/common/Text'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { Header } from '../components/common/Header'
import { Icon } from '../components/common/Icon'
import { CircleProgress } from './mainScreen/CircleProgress'
import { assets } from '../assets/index'
import { useTheme } from '../components/context/ThemeContext'
import { CycleCard } from './profileScreen/CycleCard'
import { FlatList, StyleSheet } from 'react-native'
import { navigate } from '../services/navigationService'
import { PrimaryButton } from '../components/common/buttons/PrimaryButton'
import { AvatarOption } from './avatarAndTheme/avatarSelect/AvatarOption'
import { ThemeSelectItem } from './avatarAndTheme/ThemeSelectItem'
import { useHistoryPrediction, useTodayPrediction } from '../components/context/PredictionProvider'
import { useSelector } from '../hooks/useSelector'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { translate } from '../i18n/index'
import { IconButton } from '../components/common/buttons/IconButton'
import { profileScreenSpeech } from '../config'
import { useTextToSpeechHook } from '../hooks/useTextToSpeechHook'
import moment from 'moment'
import { ThemedModal } from '../components/common/ThemedModal'
import { getDeviceFontScale } from '../services/font'

import { CustomProfileScreenWidget } from '../optional/CustomComponents'

export function ProfileScreen({ navigation }) {
  const History = useHistoryPrediction()
  const selectedAvatar = useSelector(selectors.currentAvatarSelector)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [error, setError] = React.useState(false)
  const shouldSkip = React.useRef(0)
  const currentUser = useSelector(selectors.currentUserSelector)
  const errorCode: any = useSelector(selectors.authError)
  const todayInfo = useTodayPrediction()
  const { id: theme } = useTheme()
  const dispatch = useDispatch()

  const connectAccountCount = useSelector((state) => state.auth.connectAccountAttempts)
  const dateOfBirth = moment(currentUser.dateOfBirth)

  useTextToSpeechHook({
    navigation,
    text: profileScreenSpeech({ currentUser, todayInfo, dateOfBirth, selectedAvatar, theme }),
  })

  React.useEffect(() => {
    if (shouldSkip.current < 1) {
      // This skips the first render when opening up the app. And only waits for more connect account attempts from buttons presses after that
      shouldSkip.current += 1
      return
    }
    setError(true)
  }, [connectAccountCount, error, errorCode])

  if (!currentUser) {
    return <Empty />
  }

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="profile" showGoBackButton={false} />

        <FlatList
          data={History}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => <CycleCard item={item} cycleNumber={index + 1} />}
          ListHeaderComponent={
            <Container>
              <Touchable onPress={() => navigate('EditProfileScreen', null)}>
                <Row style={[styles.firstRow, { borderBottomWidth: currentUser.isGuest ? 0 : 1 }]}>
                  <Column style={styles.center}>
                    <Icon
                      source={
                        currentUser.isGuest
                          ? assets.static.icons.profileGuest
                          : assets.static.icons.profileL
                      }
                      style={styles.icon}
                    />
                  </Column>
                  <Column style={styles.start}>
                    <Text style={styles.headerText}>name</Text>
                    <Text style={styles.headerText}>age</Text>
                    <Text style={styles.headerText}>gender</Text>
                    <Text style={styles.headerText}>location</Text>
                  </Column>
                  <Column style={styles.start}>
                    <ItemDescription>{currentUser.name}</ItemDescription>
                    <ItemDescription>
                      {translate(dateOfBirth.format('MMM')) + ' ' + dateOfBirth.format('YYYY')}
                    </ItemDescription>
                    <ItemDescription>
                      {translate(currentUser.gender).length > 13
                        ? translate(currentUser.gender).substring(0, 13 - 3) + '...'
                        : translate(currentUser.gender)}
                    </ItemDescription>
                    <ItemDescription>
                      {translate(
                        currentUser.location.length > 10
                          ? currentUser.location.substring(0, 10 - 3) + '...'
                          : currentUser.location,
                      )}
                    </ItemDescription>
                  </Column>
                </Row>
              </Touchable>
              {currentUser.isGuest && (
                <>
                  <Row>
                    <Column style={styles.row}>
                      <IconButton
                        name="infoPink"
                        onPress={() => {
                          setIsModalVisible(true)
                        }}
                        touchableStyle={styles.infoButton}
                      />
                      <Text style={styles.guestText}>guest_mode_user_alert</Text>
                    </Column>

                    <Column style={styles.start}>
                      <PrimaryButton
                        style={styles.connectButton}
                        textStyle={styles.white}
                        onPress={() => {
                          setError(false)
                          dispatch(actions.convertGuestAccount(currentUser))
                        }}
                      >
                        connect_account
                      </PrimaryButton>
                    </Column>
                  </Row>
                  {error && (
                    <Row style={styles.errorRow}>
                      <Text style={styles.errorText}>
                        {errorCode === 409 ? 'error_same_name' : 'error_connect_guest'}
                      </Text>
                    </Row>
                  )}
                </>
              )}
              <Row>
                <Column>
                  <CircleProgress
                    disabled={true}
                    fillColor="#FFC900"
                    emptyFill="#F49200"
                    size={60}
                  />
                </Column>
                <Column style={styles.start}>
                  <Text style={styles.valuesText}>cycle_length</Text>
                  <Text style={styles.valuesText}>period_length</Text>
                </Column>
                <Column style={styles.start}>
                  <ItemDescription>{`${
                    todayInfo.cycleLength === 100 ? '-' : todayInfo.cycleLength
                  } ${translate('days')}`}</ItemDescription>
                  <ItemDescription>{`${
                    todayInfo.periodLength === 0 ? '-' : todayInfo.periodLength
                  } ${translate('days')}`}</ItemDescription>
                </Column>
              </Row>
              <Touchable onPress={() => navigate('AvatarAndThemeScreen', null)}>
                <Row style={styles.lastRow}>
                  <Column>
                    <AvatarOption
                      isDisabled={true}
                      avatar={selectedAvatar}
                      isSelected={false}
                      style={styles.avatarOption}
                    />
                  </Column>
                  <Column style={styles.start}>
                    <ShadowWrapper>
                      <ThemeSelectItem theme={theme} />
                    </ShadowWrapper>
                  </Column>
                  <Column style={styles.start}>
                    <ItemDescription style={styles.capitalize}>
                      {translate(selectedAvatar)}
                    </ItemDescription>
                    <ItemDescription style={styles.capitalize}>{translate(theme)}</ItemDescription>
                  </Column>
                </Row>
              </Touchable>
            </Container>
          }
          ListFooterComponent={<BottomFill />}
        />
      </PageContainer>
      <ThemedModal isVisible={isModalVisible} setIsVisible={setIsModalVisible}>
        <CardPicker>
          <Heading>alert</Heading>
          <TextContent>connect_account_info</TextContent>
        </CardPicker>
      </ThemedModal>

      <CustomProfileScreenWidget />
    </BackgroundTheme>
  )
}

const FONT_SCALE = getDeviceFontScale()

const Row = styled.View`
  min-height: ${FONT_SCALE === 'EXTRA_LARGE' ? 128 : FONT_SCALE === 'LARGE' ? 120 : 100}px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #eaeaea;
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
`

const Touchable = styled.TouchableOpacity``

const Container = styled.View`
  background-color: white;
  elevation: 3;
  margin-horizontal: 3px;
  border-radius: 10px;
`

const Empty = styled.View``

const Column = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const ItemDescription = styled(TextWithoutTranslation)`
  height: 30px;
  font-size: 16;
  text-align-vertical: center;
  font-family: Roboto-Black;
  color: #000;
`

const BottomFill = styled.View`
  height: 20px;
  width: 100%;
`

const ShadowWrapper = styled.View`
  height: 60px;
  width: 90px;
`
const CardPicker = styled.View`
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15;
  padding-horizontal: 15;
`

const Heading = styled(Text)`
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10;
  color: #a2c72d;
`

const TextContent = styled(Text)`
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10;
`

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  start: {
    alignItems: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  white: {
    color: 'white',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  connectButton: {
    height: 60,
    minWidth: 115,
    maxWidth: 180,
    padding: 4,
    alignSelf: 'center',
    backgroundColor: '#a2c72d',
  },
  errorRow: {
    minHeight: 40,
    height: 40,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    textAlignVertical: 'center',
    alignSelf: 'center',
    bottom: 0,
  },
  headerText: {
    minHeight: 30,
    textAlignVertical: 'center',
    fontSize: 12,
  },
  guestText: {
    width: '70%',
    textAlign: 'left',
    paddingLeft: 10,
    fontSize: 12,
    alignSelf: 'center',
  },
  valuesText: {
    minHeight: 30,
    fontSize: 12,
    textAlignVertical: 'center',
  },
  avatarOption: {
    height: 70,
    width: 70,
    marginBottom: 0,
  },
  infoButton: {
    paddingLeft: 40,
  },
  icon: {
    height: 57,
    width: 57,
  },
  firstRow: {
    minHeight: FONT_SCALE === 'EXTRA_LARGE' ? 150 : FONT_SCALE === 'LARGE' ? 145 : 140,
  },
  lastRow: {
    borderBottomWidth: 0,
    minHeight: FONT_SCALE === 'EXTRA_LARGE' ? 150 : FONT_SCALE === 'LARGE' ? 145 : 140,
  },
})
