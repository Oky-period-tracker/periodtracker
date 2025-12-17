import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Text } from './Text'
import { Modal, ModalProps } from './Modal'
import { IconButton } from './IconButton'
import moment from 'moment'
import {
  useHistoryPrediction,
  useIsActiveSelector,
  usePredictDay,
  usePredictionDispatch,
  useTodayPrediction,
  usePredictionEngineState,
  useCalculatePeriodDates,
} from '../contexts/PredictionProvider'
import { useSelector } from '../redux/useSelector'
import { decisionProcessNonPeriod, decisionProcessPeriod } from '../prediction/predictionLogic'
import { useDispatch } from 'react-redux'
import { currentUserSelector, isFuturePredictionSelector } from '../redux/selectors'
import { answerVerifyDates, smartPredictionRequest, updateFuturePrediction } from '../redux/actions'
import { fetchNetworkConnectionStatus } from '../services/network'
import { User } from '../redux/reducers/authReducer'
import { DayData } from '../screens/MainScreen/DayScrollContext'
import { Button } from './Button'
import { useTutorial } from '../screens/MainScreen/TutorialContext'
import { useAvatarMessage } from '../contexts/AvatarMessageContext'
import { isFutureDate } from '../services/dateUtils'
import { useFormatDate } from '../hooks/useFormatDate'
import { useLoading } from '../contexts/LoadingProvider'
import { analytics } from '../services/firebase'
import { PeriodDate } from '../screens/CalendarScreen'
// import { usePredictDay } from "../contexts/PredictionProvider";

export const DayModal = ({
  data,
  visible,
  toggleVisible,
  hideLaunchButton,
  onHandleResponse,
}: { data: DayData } & ModalProps) => {
  const selectedDayInfo = data
  const inputDay = data.date
  const { setAvatarMessage } = useAvatarMessage()
  const { formatMomentDayMonth } = useFormatDate()

  // const dataEntry = usePredictDay(date);

  // const { id: themeName } = useTheme();
  // const source = useStatusForSource(themeName);
  const dispatch = usePredictionDispatch()
  // const undoFunc = useUndoPredictionEngine();
  const history = useHistoryPrediction()
  const selectedDayInfoEngine = usePredictDay(inputDay)
  const isActive = useIsActiveSelector()
  const reduxDispatch = useDispatch()
  const currentUser = useSelector(currentUserSelector) as User // TODO:
  const userID = currentUser?.id
  const currentCycleInfo = useTodayPrediction()
  const inputDayStr = moment(inputDay).format('YYYY-MM-DD')
  const todayStr = moment().format('YYYY-MM-DD')
  
  // Check if this day is user verified as period day
  const inputDayFormatted = inputDay.format('DD/MM/YYYY')
  const isUserVerifiedPeriodDay = React.useMemo(() => {
    if (!currentUser?.metadata?.periodDates) return false
    return currentUser.metadata.periodDates.some(
      (pd) => pd.date === inputDayFormatted && pd.userVerified === true
    )
  }, [currentUser?.metadata?.periodDates, inputDayFormatted])

  // flower
  // const cardAnswersToday = useSelector((state) =>
  //   verifyPeriodDaySelectorWithDate(state, moment(inputDayStr))
  // );

  const predictionFullState = usePredictionEngineState()
  const [addNewCycleHistory, setNewCycleHistory] = React.useState(false)
  const hasFuturePredictionActive = useSelector(isFuturePredictionSelector)
  const futurePredictionStatus = hasFuturePredictionActive?.futurePredictionStatus
  const calculatePeriodDates = useCalculatePeriodDates()
  const [periodDates, setPeriodDates] = useState<PeriodDate[]>(calculatePeriodDates)
  React.useEffect(() => {
    if (moment(inputDay).diff(moment(currentCycleInfo.cycleStart), 'days') < 0) {
      setNewCycleHistory(true)
    } else {
      setNewCycleHistory(false)
    }
  }, [addNewCycleHistory, inputDay])

  // const minimizeToTutorial = () => {
  //   toggleVisible();
  //   setTimeout(
  //     () => {
  //       navigateToTutorial();
  //     },
  //     Platform.OS === "ios" ? 500 : 300
  //   );
  // };

  if (inputDay === null) {
    return <View />
  }

  // TODO:
  // eslint-disable-next-line
  const errorCallBack = (err: string) => {
    // if (err) {
    //   setAvatarMessage(err);
    // }
    return null
  }

  const updateUserVerifiedStatus = (
    periodDates: PeriodDate[],
    selectedDate: string,
    isVerified: boolean,
  ) => {
    const formattedSelectedDate = moment(selectedDate).format('DD-MM-YYYY')
    return periodDates.map((entry) =>
      entry.date === formattedSelectedDate ? { ...entry, 'user-verified': isVerified } : entry,
    )
  }

  // TODO:
  // eslint-disable-next-line
  const getPredictedCycles = (flag: boolean): any => {
    if (flag) {
      // @ts-expect-error TODO: THIS IS ALWAYS TRUE !!!!
      if (fetchNetworkConnectionStatus()) {
        const tempHistory = [...history]
        const tempPeriodsCycles = []
        const tempPeriodsLength = []
        tempPeriodsCycles.push(predictionFullState.currentCycle.cycleLength)
        tempPeriodsLength.push(predictionFullState.currentCycle.periodLength)
        tempHistory.forEach((item) => {
          tempPeriodsCycles.push(item.cycleLength)
          tempPeriodsLength.push(item.periodLength)
        })
        tempPeriodsCycles.reverse()
        tempPeriodsLength.reverse()
        for (let i = 0; i < 10; i++) {
          if (tempPeriodsCycles.length < 10) {
            tempPeriodsCycles.unshift(0)
            tempPeriodsLength.unshift(0)
          }
        }

        reduxDispatch(
          smartPredictionRequest({
            cycle_lengths: tempPeriodsCycles,
            period_lengths: tempPeriodsLength,
            age: moment().diff(moment(currentUser.dateOfBirth), 'years'),
            predictionFullState,
            futurePredictionStatus,
          }),
        )
      }
    }
    reduxDispatch(
      updateFuturePrediction(Boolean(futurePredictionStatus), predictionFullState.currentCycle),
    )
  }

  const actionPink = decisionProcessPeriod({
    inputDay,
    selectedDayInfo: selectedDayInfoEngine,
    currentCycleInfo,
    history,
    isActive,
    // errorCallBack,
    // getPredictedCycles,
  })

  const actionBlue = decisionProcessNonPeriod({
    inputDay,
    selectedDayInfo: selectedDayInfoEngine,
    currentCycleInfo,
    history,
    isActive,
  })

  const checkForDay = () => {
    // For Current day
    if (moment(inputDayStr).isSame(moment(todayStr))) {
      if (
        !selectedDayInfo.onPeriod &&
        inputDay.diff(moment().startOf('day'), 'days') === 0 &&
        inputDay.diff(selectedDayInfo.cycleStart, 'days') >=
          selectedDayInfo.periodLength + minBufferBetweenCycles
      ) {
        if (moment(todayStr).diff(moment(currentCycleInfo.cycleStart), 'days') < 11) {
          dispatch({
            type: actionPink.type,
            inputDay: actionPink.day,
            errorCallBack,
          })
        } else {
          dispatch({
            type: 'start-next-cycle',
            inputDay,
            errorCallBack,
            getPredictedCycles,
          })
        }
      } else {
        if (actionPink) {
          dispatch({
            type: actionPink.type,
            inputDay: actionPink.day,
            errorCallBack,
            getPredictedCycles,
          })
        }
      }
    } else {
      dispatch({
        type: actionPink.type,
        inputDay: actionPink.day,
        errorCallBack,
        getPredictedCycles,
      })
    }
    reduxDispatch(
      answerVerifyDates({
        userID,
        utcDateTime: inputDay,
        periodDay: true,
      }),
    )
    // Call onHandleResponse to trigger cycle recalculation
    if (onHandleResponse) {
      onHandleResponse(true, inputDay.format('DD/MM/YYYY'))
    }
  }

  function onYesPress() {
    console.log('[DayModal] ========== YES BUTTON CLICKED ==========')
    console.log('[DayModal] Input day:', inputDay.format('YYYY-MM-DD'), '|', inputDay.format('DD/MM/YYYY'))
    console.log('[DayModal] Selected day info:', {
      onPeriod: selectedDayInfo.onPeriod,
      cycleStart: selectedDayInfo.cycleStart?.format('YYYY-MM-DD'),
      periodLength: selectedDayInfo.periodLength,
    })
    console.log('[DayModal] Add new cycle history:', addNewCycleHistory)
    console.log('[DayModal] Current period dates:', periodDates)
    
    analytics?.().logEvent('periodDayCloudTap', { userId: currentUser.id })

    if (isFutureDate(inputDay)) {
      console.log('[DayModal] Future date detected, aborting')
      setAvatarMessage('too_far_ahead', true)
      toggleVisible()
      return
    }

    // Check if already verified - if so, just update prediction engine if needed
    if (isUserVerifiedPeriodDay) {
      console.log('[DayModal] Day is already user verified as period day')
      // Still dispatch to prediction engine to ensure onPeriod is true
      if (!selectedDayInfo.onPeriod) {
        console.log('[DayModal] Day is verified but onPeriod is false, updating prediction engine')
        checkForDay()
      } else {
        console.log('[DayModal] Day is verified and onPeriod is already true, just dispatching answerVerifyDates')
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          }),
        )
      }
      toggleVisible()
      return
    }

    if (addNewCycleHistory) {
      console.log('[DayModal] Branch: addNewCycleHistory = true')
      if (selectedDayInfo.onPeriod) {
        console.log('[DayModal] Already on period (prediction), dispatching answerVerifyDates and updating prediction engine')
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          }),
        )
        // Update prediction engine to ensure onPeriod stays true
        if (actionPink) {
          dispatch({
            type: actionPink.type,
            inputDay: actionPink.day,
            errorCallBack,
            getPredictedCycles,
          })
        }
      } else {
        console.log('[DayModal] Not on period, adding new cycle history')
        dispatch({
          type: 'add-new-cycle-history',
          inputDay,
          errorCallBack,
          getPredictedCycles,
        })
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          }),
        )
      }
      if (onHandleResponse) {
        const dateStr = inputDay.format('DD/MM/YYYY')
        console.log('[DayModal] Calling onHandleResponse with:', { isPeriodDay: true, periodDate: dateStr })
        onHandleResponse(true, dateStr) // This will update userVerified = true
      }
    } else {
      console.log('[DayModal] Branch: addNewCycleHistory = false')
      if (selectedDayInfo.onPeriod) {
        console.log('[DayModal] Already on period (prediction), updating data and prediction engine')
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          }),
        )
        // Update prediction engine to ensure onPeriod stays true
        if (actionPink) {
          dispatch({
            type: actionPink.type,
            inputDay: actionPink.day,
            errorCallBack,
            getPredictedCycles,
          })
        }
        getUpdatedData()
        toggleVisible()
        if (onHandleResponse) {
          const dateStr = inputDay.format('DD/MM/YYYY')
          console.log('[DayModal] Calling onHandleResponse with:', { isPeriodDay: true, periodDate: dateStr })
          onHandleResponse(true, dateStr) // This will update userVerified = true
        }
      } else {
        console.log('[DayModal] Not on period, checking for day and updating prediction engine')
        checkForDay()
      }
    }

    toggleVisible()
    console.log('[DayModal] ========== YES BUTTON HANDLING COMPLETE ==========')
  }
  const getUpdatedData = () => {
    console.log('[DayModal] getUpdatedData called')
    console.log('[DayModal] Current periodDates:', periodDates)
    console.log('[DayModal] Input day formatted:', inputDay.format('YYYY-MM-DD'))
    const updatedPeriodDates = updateUserVerifiedStatus(
      periodDates,
      inputDay.format('YYYY-MM-DD'),
      true,
    )
    console.log('[DayModal] Updated periodDates:', updatedPeriodDates)
    setPeriodDates(updatedPeriodDates)
  }
  const onNoPress = () => {
    console.log('[DayModal] ========== NO BUTTON CLICKED ==========')
    console.log('[DayModal] Input day:', inputDay.format('YYYY-MM-DD'), '|', inputDay.format('DD/MM/YYYY'))
    console.log('[DayModal] Selected day info engine:', {
      onPeriod: selectedDayInfoEngine.onPeriod,
    })
    console.log('[DayModal] Is user verified period day:', isUserVerifiedPeriodDay)
    
    analytics?.().logEvent('noPeriodDayCloudTap', { userId: currentUser.id })

    if (moment(inputDay).isAfter(moment())) {
      console.log('[DayModal] Future date detected, aborting')
      setAvatarMessage('too_far_ahead', true)
      toggleVisible()
      return
    }

    // Check if day is user verified or predicted as period day
    const isPeriodDay = isUserVerifiedPeriodDay || selectedDayInfoEngine.onPeriod

    if (isPeriodDay) {
      console.log('[DayModal] Day is period day (verified or predicted), processing NO action')
      
      // Update prediction engine to remove period day
      if (actionBlue) {
        console.log('[DayModal] Dispatching actionBlue:', actionBlue.type)
        dispatch({
          type: actionBlue.type,
          inputDay: actionBlue.day,
          errorCallBack,
          getPredictedCycles,
        })
      }
      
      reduxDispatch(
        answerVerifyDates({
          userID,
          utcDateTime: inputDay,
          periodDay: false,
        }),
      )

      if (onHandleResponse) {
        const dateStr = inputDay.format('DD/MM/YYYY')
        console.log('[DayModal] Calling onHandleResponse with:', { isPeriodDay: false, periodDate: dateStr })
        onHandleResponse(false, dateStr) // This will remove userVerified or set it to false
      }
    } else {
      console.log('[DayModal] Day is not on period, nothing to do')
    }
    toggleVisible()
    console.log('[DayModal] ========== NO BUTTON HANDLING COMPLETE ==========')
  }

  return (
    <Modal
      visible={visible}
      toggleVisible={toggleVisible}
      style={styles.modal}
      hideLaunchButton={false}
    >
      {!hideLaunchButton && <LaunchTutorialButton toggleVisible={toggleVisible} />}
      <Text style={styles.title}>user_input_instructions</Text>
      <Text style={styles.description}>share_period_details_heading</Text>

      <IconButton size={160} text={formatMomentDayMonth(inputDay)} status={'basic'} />

      <View style={styles.buttons} pointerEvents="box-none">
        <IconButton onPress={onYesPress} size={100} text={'Yes'} status={'danger'} />
        <IconButton onPress={onNoPress} size={100} text={'No'} />
      </View>
    </Modal>
  )
}

const LaunchTutorialButton = ({ toggleVisible }: { toggleVisible: () => void }) => {
  const { setLoading } = useLoading()
  const { dispatch } = useTutorial()

  const onPress = () => {
    toggleVisible() // Hide DayModal
    setLoading(true, 'please_wait_tutorial', () => {
      dispatch({ type: 'start', value: 'tutorial_one' })
    })
  }

  return (
    <View style={styles.infoRow}>
      <Button onPress={onPress} style={styles.infoButton} status={'danger_light'}>
        <FontAwesome size={12} name={'info'} color={'#fff'} />
      </Button>

      <TouchableOpacity onPress={onPress}>
        <Text style={styles.label}>{'tutorial_launch_label'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const minBufferBetweenCycles = 2

const styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  dateIcon: {
    width: 160,
    height: 160,
  },
  buttons: {
    marginTop: 48,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  infoButton: {
    height: 24,
    width: 24,
    marginRight: 12,
  },
  label: {
    color: '#fff',
  },
})
