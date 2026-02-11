import * as React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import moment from 'moment'
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
import { httpClient } from '../../services/HttpClient'
import { User } from '../../types'
import { editUser } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import { appTokenSelector, currentUserSelector } from '../../redux/selectors'
import { generatePeriodDates } from '../../prediction/predictionLogic'
import { usePredictionEngineState } from '../../contexts/PredictionProvider'
import { useCycleCalculation } from '../../hooks/useCycleCalculation'

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

  const currentUser = useSelector(currentUserSelector) as User
  const appToken = useSelector(appTokenSelector)
  const reduxDispatch = useDispatch()
  const predictionFullState = usePredictionEngineState()
  const [friendUnlockModalVisible, setFriendUnlockModalVisible] = React.useState(false)
  const { updateCycleCount } = useCycleCalculation()

  // Check if friend unlock modal should be shown
  const shouldShowFriendUnlockModal = React.useMemo(() => {
    if (!currentUser) return false
    const cyclesNumber = currentUser.cyclesNumber || 0
    const avatar = currentUser.avatar

    return (
      cyclesNumber >= 3 &&
      (avatar === null || avatar === undefined || avatar.customAvatarUnlocked === false)
    )
  }, [currentUser?.cyclesNumber, currentUser?.avatar])

  // Show modal when screen opens or cyclesNumber changes
  useFocusEffect(
    React.useCallback(() => {
      if (shouldShowFriendUnlockModal) {
        setFriendUnlockModalVisible(true)
      }
      if (route.params?.tutorial) {
        setLoading(true, 'please_wait_tutorial', () => {
          tutorialDispatch({ type: 'start', value: route.params?.tutorial })
          // Reset to prevent re-triggering
          navigation.setParams({ tutorial: undefined })
        })
      }
    }, [shouldShowFriendUnlockModal, route.params?.tutorial]),
  )

  // Also check when cyclesNumber changes
  React.useEffect(() => {
    if (shouldShowFriendUnlockModal) {
      setFriendUnlockModalVisible(true)
    }
  }, [shouldShowFriendUnlockModal])

  // Auto start tutorial due to route params

  React.useEffect(() => {
    const initPeriodDates = async () => {
      if (!currentUser?.metadata?.periodDates?.length) {
        const data = generatePeriodDates(predictionFullState)
        // Only update local Redux state, don't sync to server on mount
        editUserReduxState({ metadata: { periodDates: data } })
      }

      // Always recalculate cycles on mount to sync locks
      // This ensures cyclesNumber is correct after app restart/update
      const dates = currentUser?.metadata?.periodDates || []
      if (dates.length > 0) {
        await updateCycleCount(dates)
      }
    }

    initPeriodDates()
  }, [currentUser?.id, appToken])

  const updateUserVerifiedDates = (changes: Partial<User>) => {
    if (!appToken) {
      console.warn('Cannot update verified dates: no app token', { 
        hasCurrentUser: !!currentUser, 
        currentUserId: currentUser?.id,
        appTokenType: typeof appToken,
        appTokenValue: appToken 
      })
      return Promise.resolve()
    }
    return httpClient.updateUserVerifiedDays({
      appToken,
      ...changes,
    })
  }

  const editUserReduxState = (changes: Partial<User>) => {
    reduxDispatch(editUser(changes))
  }

  const avatarHidden = state.isPlaying && step !== 'avatar'
  const circleProgressHidden = state.isPlaying && step !== 'calendar'
  const wheelHidden = state.isPlaying && step !== 'wheel' && step !== 'wheel_button'
  const centerCardHidden = state.isPlaying && step !== 'wheel' && step !== 'center_card'
  const carouselHidden = state.isPlaying && !['track', 'summary', 'stars'].includes(step ?? '')

  const goToCalendar = () => navigation.navigate('Calendar')
  const handleDayModalResponse = async (isPeriodDay: boolean, periodDate: string) => {
    const predictedPeriodDates = generatePeriodDates(predictionFullState)

    let updatedPeriodDates = currentUser.metadata?.periodDates
      ? [...currentUser.metadata.periodDates]
      : []

    const mlDatesToAdd = predictedPeriodDates
      .filter((entry) => !updatedPeriodDates.some((u) => u.date === entry.date))
      .map((entry) => ({
        ...entry,
        mlGenerated: false,
        userVerified: entry.userVerified || false,
      }))
    updatedPeriodDates = [...updatedPeriodDates, ...mlDatesToAdd]

    const isMlPredicted = predictedPeriodDates.some((entry) => entry.date === periodDate)
    const existingDateIndex = updatedPeriodDates.findIndex((entry) => entry.date === periodDate)

    let shouldRecalculateCycles = false

    if (isPeriodDay) {
      if (existingDateIndex !== -1) {
        const existingEntry = updatedPeriodDates[existingDateIndex]
        
        if (existingEntry.userVerified === true) {
          return
        } else {
          updatedPeriodDates[existingDateIndex] = {
            ...existingEntry,
            userVerified: true,
            mlGenerated: false,
          }
          shouldRecalculateCycles = true
        }
      } else {
        updatedPeriodDates.push({
          date: periodDate,
          mlGenerated: isMlPredicted,
          userVerified: true,
        })
        shouldRecalculateCycles = true
      }
    } else {
      if (existingDateIndex !== -1) {
        const existingEntry = updatedPeriodDates[existingDateIndex]
        
        if (existingEntry.userVerified === true) {
          updatedPeriodDates.splice(existingDateIndex, 1)
          shouldRecalculateCycles = true
        } else {
          updatedPeriodDates.splice(existingDateIndex, 1)
        }
      } else {
        return
      }
    }

    updatedPeriodDates.sort((a, b) => {
      const dateA = moment(a.date, ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'], true)
      const dateB = moment(b.date, ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'], true)
      return dateA.valueOf() - dateB.valueOf()
    })

    try {
      await updateUserVerifiedDates({
        metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
      })

      editUserReduxState({
        metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
      })

      if (shouldRecalculateCycles) {
        await updateCycleCount(updatedPeriodDates)
      }
    } catch (error) {
      console.error('Error updating period dates:', error)
    }
  }


  const handleCreateFriend = async () => {
    if (!currentUser) return

    // Only update customAvatarUnlocked = true, preserve existing avatar data
    const updatedAvatar = { customAvatarUnlocked: true };
    
    // Save to Redux state immediately (local save)
    editUserReduxState({
      avatar: updatedAvatar,
    })

    // Navigate to custom avatar screen in ProfileStack
    // Since MainScreen is in HomeStack, we need to navigate to the profile tab first
    const parentNavigation = navigation.getParent()
    if (parentNavigation) {
      parentNavigation.navigate('profile', { screen: 'CustomAvatar' })
    } else {
      // Fallback: try direct navigation (shouldn't happen but just in case)
      navigation.navigate('CustomAvatar' as any)
    }
    
    // Sync with server in the background - ONLY send customAvatarUnlocked
    if (appToken) {
      httpClient.updateAvatar({
        appToken,
        avatar: { customAvatarUnlocked: true },
      }).catch((error) => {
      })
    }
  }
  
  return (
    <>
      <View style={styles.screen}>
        <View style={styles.body} onLayout={onBodyLayout}>
          <View style={styles.topLeft} onLayout={onTopLeftLayout}>
            <View style={styles.circleProgressContainer}>
            <CircleProgress onPress={goToCalendar} style={circleProgressHidden && styles.hidden} />
            <TouchableOpacity onPress={goToCalendar} style={circleProgressHidden && styles.hidden}>
              <Text>calendar</Text>
            </TouchableOpacity>
            </View>
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
      <FriendUnlockModal
        visible={friendUnlockModalVisible}
        toggleVisible={() => setFriendUnlockModalVisible(false)}
        onCreateFriend={handleCreateFriend}
      />
    </>
  )
}

export default MainScreen

const styles = StyleSheet.create({
  circleProgressContainer: {
    top: 0,
  },
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
