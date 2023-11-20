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
import { FlatList } from 'react-native'
import { navigate } from '../services/navigationService'
import { toAge } from '../services/dateUtils'
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
  if (!currentUser) return <Empty />
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
                <Row style={{ height: 140, borderBottomWidth: currentUser.isGuest ? 0 : 1 }}>
                  <Column style={{ justifyContent: 'flex-start', paddingTop: 10 }}>
                    <Icon
                      source={
                        currentUser.isGuest
                          ? assets.static.icons.profileGuest
                          : assets.static.icons.profileL
                      }
                      style={{ height: 57, width: 57 }}
                    />
                  </Column>
                  <Column style={{ alignItems: 'flex-start' }}>
                    <Text style={{ height: 30, textAlignVertical: 'center', fontSize: 12 }}>
                      name
                    </Text>
                    <Text style={{ height: 30, textAlignVertical: 'center', fontSize: 12 }}>
                      age
                    </Text>
                    <Text style={{ height: 30, textAlignVertical: 'center', fontSize: 12 }}>
                      gender
                    </Text>
                    <Text style={{ height: 30, textAlignVertical: 'center', fontSize: 12 }}>
                      location
                    </Text>
                  </Column>
                  <Column style={{ alignItems: 'flex-start' }}>
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
                    <Column style={{ flexDirection: 'row' }}>
                      <IconButton
                        name="infoPink"
                        onPress={() => {
                          setIsModalVisible(true)
                        }}
                        touchableStyle={{ paddingLeft: 40 }}
                        source={assets.static.icons.infoPink}
                      />
                      <Text
                        style={{
                          width: '70%',
                          textAlign: 'left',
                          paddingLeft: 10,
                          fontSize: 12,
                          alignSelf: 'center',
                        }}
                      >
                        guest_mode_user_alert
                      </Text>
                    </Column>
                    <Column>
                      <PrimaryButton
                        style={{
                          height: 50,
                          width: 115,
                          alignSelf: 'center',
                          backgroundColor: '#a2c72d',
                        }}
                        textStyle={{ color: 'white' }}
                        onPress={() => {
                          setError(false)
                          dispatch(
                            actions.convertGuestAccount({
                              id: currentUser.id,
                              name: currentUser.name,
                              dateOfBirth: currentUser.dateOfBirth,
                              gender: currentUser.gender,
                              location: currentUser.location,
                              country: currentUser.country,
                              province: currentUser.province,
                              password: currentUser.password,
                              secretQuestion: currentUser.secretQuestion,
                              secretAnswer: currentUser.secretAnswer,
                            }),
                          )
                        }}
                      >
                        connect_account
                      </PrimaryButton>
                    </Column>
                  </Row>
                  {error && (
                    <Row style={{ height: 40 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'red',
                          textAlignVertical: 'center',
                          alignSelf: 'center',
                          bottom: 0,
                        }}
                      >
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
                <Column style={{ alignItems: 'flex-start' }}>
                  <Text style={{ height: 30, fontSize: 12, textAlignVertical: 'center' }}>
                    cycle_length
                  </Text>
                  <Text style={{ height: 30, fontSize: 12, textAlignVertical: 'center' }}>
                    period_length
                  </Text>
                </Column>
                <Column style={{ alignItems: 'flex-start' }}>
                  <ItemDescription>{`${
                    todayInfo.cycleLength === 100 ? '-' : todayInfo.cycleLength
                  } ${translate('days')}`}</ItemDescription>
                  <ItemDescription>{`${
                    todayInfo.periodLength === 0 ? '-' : todayInfo.periodLength
                  } ${translate('days')}`}</ItemDescription>
                </Column>
              </Row>
              <Touchable onPress={() => navigate('AvatarAndThemeScreen', null)}>
                <Row style={{ borderBottomWidth: 0 }}>
                  <Column style={{ width: 70, height: 70, overflow: 'hidden' }}>
                    <AvatarOption
                      isDisabled={true}
                      nameStyle={{ fontSize: 10 }}
                      avatar={selectedAvatar}
                      isSelected={false}
                      style={{ flex: 1 }}
                    />
                  </Column>
                  <Column style={{ alignItems: 'flex-start' }}>
                    <ShadowWrapper>
                      <ThemeSelectItem theme={theme} />
                    </ShadowWrapper>
                  </Column>
                  <Column style={{ alignItems: 'flex-start' }}>
                    <ItemDescription style={{ textTransform: 'capitalize' }}>
                      {translate(selectedAvatar)}
                    </ItemDescription>
                    <ItemDescription style={{ textTransform: 'capitalize' }}>
                      {translate(theme)}
                    </ItemDescription>
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
    </BackgroundTheme>
  )
}

const Row = styled.View`
  height: 100px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #eaeaea;
  align-items: center;
  justify-content: center;
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
  height: 100%;
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
