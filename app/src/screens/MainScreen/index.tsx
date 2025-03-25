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
import { PeriodDate } from '../CalendarScreen'

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

  // console.log('currentUser', currentUser);
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
      udpateUserVerifiedDates({ metadata: { periodDates: data } })
      editUserReduxState({ metadata: { periodDates: data } })
    }
  }, [])

  const udpateUserVerifiedDates = (changes: Partial<User>) => {
    httpClient.updateUserVerifiedDays({
      appToken,
      ...changes,
    })
  }
  // console.log('currentUser', currentUser)

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
    console.log(predictionFullState, `Date: ${periodDate}, Is Period Day: ${isPeriodDay}`, predictionFullState);
  
    // Generate the latest prediction-based period dates array
    const predictedPeriodDates = generatePeriodDates(predictionFullState);
  
    // Get the existing periodDates array from the user metadata
    let updatedPeriodDates = currentUser.metadata?.periodDates ? [...currentUser.metadata.periodDates] : [];
  
    // Merge both arrays: Use existing user data but update ML-generated entries
    updatedPeriodDates = predictedPeriodDates.map(predictedDate => {
      const existingEntry = updatedPeriodDates.find(entry => entry.date === predictedDate.date);
      return existingEntry || predictedDate; // Keep user-entered data, else use predicted
    });
  
    try {
      // Find the index of the selected date in the updated array
      const existingDateIndex = updatedPeriodDates.findIndex(entry => entry.date === periodDate);
  
      if (existingDateIndex !== -1) {
        // If the date exists
        if (updatedPeriodDates[existingDateIndex].mlGenerated && !isPeriodDay) {
          // Remove only if it was ML-generated and user marks it as non-period
          updatedPeriodDates = updatedPeriodDates.filter(entry => entry.date !== periodDate);
        } else {
          // Otherwise, just update `userVerified`
          updatedPeriodDates[existingDateIndex] = {
            ...updatedPeriodDates[existingDateIndex],
            userVerified: isPeriodDay,
          };
        }
      } else if (isPeriodDay) {
        // If the date is not in the array and user marks it as a period day, add it
        const newPeriodDate: PeriodDate = {
          date: periodDate,
          mlGenerated: false,
          userVerified: true, // Since the user is marking it as a period day
        };
  
        updatedPeriodDates.push(newPeriodDate);
      }
  
      // Sort by date to keep the order correct
      updatedPeriodDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
      console.log('Updated Period Dates:', predictionFullState, updatedPeriodDates);
  
      if (updatedPeriodDates) {
        await udpateUserVerifiedDates({
          metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
        });
  
        editUserReduxState({
          metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
        });
  
        // setPeriodDatesArray(updatedPeriodDates);
      }
    } catch (error) {
      console.error('Error updating period dates:', error);
    }
  };
  
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
