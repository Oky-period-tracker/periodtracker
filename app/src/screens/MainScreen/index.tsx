import * as React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { Carousel } from './components/Carousel'
import { CenterCard } from './components/CenterCard'
import { Wheel } from './components/Wheel'
import { useScreenDimensions } from '../../hooks/useScreenDimensions'
import { DayScrollProvider, useDayScroll } from './DayScrollContext'
import { DayModal } from '../../components/DayModal'
import { CircleProgress } from './components/CircleProgress'
import { Text } from '../../components/Text'
import { Avatar } from '../../components/Avatar'
import { FriendUnlockModal } from '../../components/FriendUnlockModal'
import { TutorialProvider, useTutorial } from './TutorialContext'
import { TutorialTextbox } from './components/TutorialTextbox'
import { TutorialArrow } from './components/TutorialArrow'
import { TutorialFeature } from './components/TutorialFeature'
import { useFocusEffect } from '@react-navigation/native'
import { useFetchSurvey } from '../../hooks/useFetchSurvey'
import { useLoading, useStopLoadingEffect } from '../../contexts/LoadingProvider'
import { AvatarMessageProvider } from '../../contexts/AvatarMessageContext'
import { IS_ANDROID } from '../../services/device'
import { usePeriodDateUpdate } from '../../hooks/usePeriodDateUpdate'
import { useSelector } from 'react-redux'
import { currentUserSelector, cyclesNumberSelector } from '../../redux/selectors'

const MainScreen: ScreenComponent<'Home'> = (props) => {
  const { setLoading } = useLoading()
  React.useEffect(() => {
    setLoading(true)
  }, [])

  useFetchSurvey()
  useStopLoadingEffect()

  return (
    <AvatarMessageProvider>
      <DayScrollProvider>
        <TutorialProvider>
          <MainScreenInner {...props} />
        </TutorialProvider>
      </DayScrollProvider>
    </AvatarMessageProvider>
  )
}

const MainScreenInner: ScreenComponent<'Home'> = ({ navigation, route }) => {
  const { selectedItem, onBodyLayout, dayModalVisible, toggleDayModal } = useDayScroll()

  const { setLoading } = useLoading()
  const { width } = useScreenDimensions()

  const { state, step, onTopLeftLayout, onWheelLayout, dispatch: tutorialDispatch } = useTutorial()

  const { handleDayModalResponse, initPeriodDatesIfEmpty } = usePeriodDateUpdate()
  const currentUser = useSelector(currentUserSelector)
  const cyclesNumber = useSelector(cyclesNumberSelector)
  const [friendUnlockModalVisible, setFriendUnlockModalVisible] = React.useState(false)

  // Check if friend unlock modal should be shown
  const shouldShowFriendUnlockModal = React.useMemo(() => {
    if (!currentUser) return false
    const avatar = currentUser.avatar
    // Show modal if cycles >= 3 and avatar is null or customAvatarUnlocked is false
    return (
      cyclesNumber >= 3 &&
      (avatar === null || avatar === undefined || avatar.customAvatarUnlocked === false)
    )
  }, [currentUser, cyclesNumber])

  // Show loading icon & tutorial when indicated by route
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.tutorial) {
        setLoading(true, 'please_wait_tutorial', () => {
          tutorialDispatch({ type: 'start', value: route.params?.tutorial })
          // Reset to prevent re-triggering
          navigation.setParams({ tutorial: undefined })
        })
      }
    }, [route.params?.tutorial]),
  )

  // Show modal when cyclesNumber changes
  React.useEffect(() => {
    if (shouldShowFriendUnlockModal) {
      setFriendUnlockModalVisible(true)
    }
  }, [shouldShowFriendUnlockModal])

  React.useEffect(() => {
    initPeriodDatesIfEmpty()
  }, [])

  const avatarHidden = state.isPlaying && step !== 'avatar'
  const circleProgressHidden = state.isPlaying && step !== 'calendar'
  const wheelHidden = state.isPlaying && step !== 'wheel' && step !== 'wheel_button'
  const centerCardHidden = state.isPlaying && step !== 'wheel' && step !== 'center_card'
  const carouselHidden = state.isPlaying && !['track', 'summary', 'stars'].includes(step ?? '')

  const goToCalendar = () => navigation.navigate('Calendar')

  return (
    <>
      <View style={styles.screen}>
        <View style={styles.body} onLayout={onBodyLayout}>
          <View style={styles.topLeft} onLayout={onTopLeftLayout}>
            <CircleProgress onPress={goToCalendar} style={circleProgressHidden && styles.hidden} />
            <TouchableOpacity onPress={goToCalendar} style={circleProgressHidden && styles.hidden}>
              <Text>calendar</Text>
            </TouchableOpacity>
            <Avatar style={avatarHidden && styles.hidden} />
          </View>

          <View
            style={[styles.wheelContainer, { width, right: -width / 2 }]}
            onLayout={onWheelLayout}
          >
            <Wheel style={wheelHidden && styles.hidden} />
            <CenterCard style={centerCardHidden && styles.hidden} />
          </View>
        </View>

        <View style={[styles.carouselContainer, carouselHidden && styles.hidden]}>
          <Carousel />
        </View>

        <TutorialArrow />
        <TutorialTextbox />
        <TutorialFeature />
      </View>
      {selectedItem && (
        <View>
          <DayModal
            visible={dayModalVisible}
            toggleVisible={toggleDayModal}
            data={selectedItem}
            hideLaunchButton={false}
            onHandleResponse={handleDayModalResponse} // Pass the method as a prop
          />
        </View>
      )}

      {/* Modal that appears when avatar customization is unlocked */}
      <View>
        <FriendUnlockModal
          visible={friendUnlockModalVisible}
          toggleVisible={() => setFriendUnlockModalVisible(false)}
        />
      </View>
    </>
  )
}

export default MainScreen

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: '100%',
    flex: 1,
  },
  topLeft: {
    flex: 1,
    width: '33%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 999, // Keep Avatar(Message) above Wheel
  },
  wheelContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    marginTop: 'auto',
    width: '100%',
  },
  button: {
    width: 80,
    height: 80,
    marginLeft: 40,
  },
  // Tutorial
  hidden: {
    opacity: IS_ANDROID ? 0.05 : 0.1,
  },
})
