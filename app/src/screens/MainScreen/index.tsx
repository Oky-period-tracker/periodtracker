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
import { calculateCycles } from '../../utils/cycleCalculator'

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

  // Auto start tutorial due to route params
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

  React.useEffect(() => {
    if (!currentUser?.metadata?.periodDates?.length) {
      const data = generatePeriodDates(predictionFullState)
      updateUserVerifiedDates({ metadata: { periodDates: data } })
      editUserReduxState({ metadata: { periodDates: data } })
    }
  }, [])

  const updateUserVerifiedDates = (changes: Partial<User>) => {
    httpClient.updateUserVerifiedDays({
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
    
    // Generate latest ML-based predictions
    const predictedPeriodDates = generatePeriodDates(predictionFullState)

    // Get the existing periodDates from user metadata
    let updatedPeriodDates = currentUser.metadata?.periodDates
      ? [...currentUser.metadata.periodDates]
      : []

    // Step 1: Ensure all ML-generated dates are included
    const mlDatesToAdd = predictedPeriodDates
      .filter((entry) => !updatedPeriodDates.some((u) => u.date === entry.date))
      .map((entry) => ({
        ...entry,
        mlGenerated: false,
        userVerified: entry.userVerified || false,
      }))
    updatedPeriodDates = [...updatedPeriodDates, ...mlDatesToAdd]

    // Step 2: Check if the selected date is ML-predicted
    const isMlPredicted = predictedPeriodDates.some((entry) => entry.date === periodDate)

    // Step 3: Find if the selected date exists in the array
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
            mlGenerated: false, // Set to false when user manually verifies
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


    try {
      // Update period dates
      await updateUserVerifiedDates({
        metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
      })

      editUserReduxState({
        metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
      })

      // Recalculate cycles if needed
      if (shouldRecalculateCycles) {
        await updateCycleCount(updatedPeriodDates)
      } else {
      }
    } catch (error) {
      console.error('Error updating period dates:', error)
    }
  }

  const updateCycleCount = async (updatedPeriodDates: { date: string; mlGenerated: boolean; userVerified: boolean | null }[]) => {
    
    try {
      // Calculate new cycles number
      const cycleResult = calculateCycles({
        ...currentUser.metadata,
        periodDates: updatedPeriodDates
      })

      // Only update if cycles number changed
      if (cycleResult.cyclesNumber !== (currentUser.cyclesNumber || 0)) {
        
        // Update backend
        if (appToken) {
          await httpClient.updateCyclesNumber({
            appToken,
            cyclesNumber: cycleResult.cyclesNumber,
          })
        }

        // Update local Redux state
        editUserReduxState({
          cyclesNumber: cycleResult.cyclesNumber,
        })
      } else {
      }
    } catch (error) {
      console.error('Error updating cycle count:', error)
    }
  }
  
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
