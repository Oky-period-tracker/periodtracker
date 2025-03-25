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
  }

  function onYesPress() {
    analytics?.().logEvent('periodDayCloudTap', { userId: currentUser.id })

    if (isFutureDate(inputDay)) {
      setAvatarMessage('too_far_ahead', true)
      toggleVisible()
      return
    }

    if (addNewCycleHistory) {
      if (selectedDayInfo.onPeriod) {
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          }),
        )
        // incFlowerProgress();
      } else {
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
        // incFlowerProgress();
      }
      if (onHandleResponse) {
        onHandleResponse(true, inputDay.format('DD/MM/YYYY')) // Invoke the onHandleResponse method with the response
      }
    } else {
      if (selectedDayInfo.onPeriod) {
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          }),
        )
        getUpdatedData()
        // incFlowerProgress();
        toggleVisible()
        if (onHandleResponse) {
          onHandleResponse(true, inputDay.format('DD/MM/YYYY')) // Invoke the onHandleResponse method with the response
        }
      } else {
        checkForDay()
      }
    }

    toggleVisible()
  }
  const getUpdatedData = () => {
    const updatedPeriodDates = updateUserVerifiedStatus(
      periodDates,
      inputDay.format('YYYY-MM-DD'),
      true,
    )
    setPeriodDates(updatedPeriodDates)
  }
  const onNoPress = () => {
    analytics?.().logEvent('noPeriodDayCloudTap', { userId: currentUser.id })

    if (moment(inputDay).isAfter(moment())) {
      setAvatarMessage('too_far_ahead', true)
      toggleVisible()
      return
    }

    if (selectedDayInfoEngine.onPeriod) {
      if (actionBlue) {
        dispatch({
          type: actionBlue.type,
          inputDay: actionBlue.day,
          errorCallBack,
          getPredictedCycles,
        })
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: false,
          }),
        )
      }

      if (onHandleResponse) {
        onHandleResponse(false, inputDay.format('DD/MM/YYYY')) // Invoke the onHandleResponse method with the response
      }
    }
    toggleVisible()
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
