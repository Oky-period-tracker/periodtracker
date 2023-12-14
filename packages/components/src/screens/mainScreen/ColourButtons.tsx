import React from 'react'
import styled from 'styled-components/native'
import { useTheme } from '../../components/context/ThemeContext'
import { Text } from '../../components/common/Text'
import {
  usePredictionDispatch,
  usePredictDay,
  useTodayPrediction,
  useUndoPredictionEngine,
  useIsActiveSelector,
  useHistoryPrediction,
  useFullState,
} from '../../components/context/PredictionProvider'
import { View, Platform, TouchableOpacity, ImageBackground } from 'react-native'
import { assets } from '../../assets'
import { useDisplayText } from '../../components/context/DisplayTextContext'
import { InformationButton } from '../../components/common/InformationButton'
import { decisionProcessNonPeriod, decisionProcessPeriod } from './predictionLogic/predictionLogic'
import { translate } from '../../i18n'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions/index'
import * as selectors from '../../redux/selectors'
import analytics from '@react-native-firebase/analytics'
import moment from 'moment'
import { fetchNetworkConnectionStatus } from '../../services/network'

import { useSelector } from '../../hooks/useSelector'
import { incrementFlowerProgress, useFlowerStateSelector, FlowerModal } from '../../optional/Flower'

const minBufferBetweenCycles = 2

function useStatusForSource(themeName) {
  switch (themeName) {
    case 'mosaic':
      return assets.static.icons.stars
    case 'desert':
      return assets.static.icons.circles
    default:
      return assets.static.icons.clouds
  }
}

export function ColourButtons({
  inputDay,
  isDayCard = false,
  hide,
  isCalendar = false,
  navigateToTutorial = () => null,
  onPress = () => null,
  cardValues,
  selectedDayInfo,
}) {
  const { id: themeName } = useTheme()
  const source = useStatusForSource(themeName)
  const { setDisplayTextStatic } = useDisplayText()
  const dispatch = usePredictionDispatch()
  const undoFunc = useUndoPredictionEngine()
  const history = useHistoryPrediction()
  const selectedDayInfoEngine = usePredictDay(inputDay)
  const isActive = useIsActiveSelector()
  const appDispatch = useDispatch()
  const userID = useSelector(selectors.currentUserSelector).id
  const currentUser = useSelector(selectors.currentUserSelector)
  const currentCycleInfo = useTodayPrediction()
  const inputDayStr = moment(inputDay).format('YYYY-MM-DD')
  const todayStr = moment().format('YYYY-MM-DD')

  const [isFlowerVisible, setFlowerVisible] = React.useState(false)
  const flowerState = useFlowerStateSelector()

  const cardAnswersToday = useSelector((state) =>
    selectors.verifyPeriodDaySelectorWithDate(state, moment(inputDayStr)),
  ) as any

  const fullState = useFullState()
  const [addNewCycleHistory, setNewCycleHistory] = React.useState(false)
  const hasFuturePredictionActive = useSelector(selectors.isFuturePredictionSelector)
  const futurePredictionStatus = hasFuturePredictionActive?.futurePredictionStatus

  React.useEffect(() => {
    if (moment(inputDay).diff(moment(currentCycleInfo.cycleStart), 'days') < 0) {
      setNewCycleHistory(true)
    }
  }, [addNewCycleHistory])

  const minimizeToTutorial = () => {
    hide()
    setTimeout(
      () => {
        navigateToTutorial()
      },
      Platform.OS === 'ios' ? 500 : 300,
    )
  }

  if (inputDay === null) {
    return <View />
  }

  const errorCallBack = (err: string): any => {
    if (err) {
      setDisplayTextStatic(err)
    }
  }
  const getPredictedCycles = (flag: boolean): any => {
    if (flag) {
      if (fetchNetworkConnectionStatus()) {
        const tempHistory = [...history]
        const tempPeriodsCycles = []
        const tempPeriodsLength = []
        tempPeriodsCycles.push(fullState.currentCycle.cycleLength)
        tempPeriodsLength.push(fullState.currentCycle.periodLength)
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
        appDispatch(
          actions.smartPredictionRequest({
            cycle_lengths: tempPeriodsCycles,
            period_lengths: tempPeriodsLength,
            age: moment().diff(moment(currentUser.dateOfBirth), 'years'),
            predictionFullState: fullState,
            futurePredictionStatus,
          }),
        )
      }
    }
    appDispatch(actions.updateFuturePrediction(futurePredictionStatus, fullState.currentCycle))
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

  const incFlowerProgress = () => {
    if (!flowerState) {
      return
    }
    const { progress, maxProgress } = flowerState
    const alreadyAnswered = cardAnswersToday?.periodDay === true
    if (progress < maxProgress && !alreadyAnswered) {
      appDispatch(incrementFlowerProgress())
      setFlowerVisible(true)
    } else {
      hide()
    }
  }

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
    appDispatch(
      actions.answerVerifyDates({
        userID,
        utcDateTime: inputDay,
        periodDay: true,
      }),
    )
  }

  function onYesPress() {
    if (fetchNetworkConnectionStatus()) {
      analytics().logEvent('periodDayCloudTap', { user: currentUser })
    }
    if (moment(inputDay).isAfter(moment())) {
      setDisplayTextStatic('too_far_ahead')
      hide()
      return
    }
    if (addNewCycleHistory) {
      if (selectedDayInfo.onPeriod) {
        appDispatch(
          actions.answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          }),
        )
        incFlowerProgress()
      } else {
        dispatch({
          type: 'add-new-cycle-history',
          inputDay,
          errorCallBack,
          getPredictedCycles,
        })
        appDispatch(
          actions.answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          }),
        )
        incFlowerProgress()
      }
    } else {
      if (selectedDayInfo.onPeriod) {
        appDispatch(
          actions.answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          }),
        )
        incFlowerProgress()
      } else {
        checkForDay()
      }
    }

    hide()
  }

  function onNoPress() {
    if (fetchNetworkConnectionStatus()) {
      analytics().logEvent('noPeriodDayCloudTap', { user: currentUser })
    }
    if (moment(inputDay).isAfter(moment())) {
      setDisplayTextStatic('too_far_ahead')
      hide()
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
        appDispatch(
          actions.answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: false,
          }),
        )
      }
    }
    hide()
  }

  return (
    <Container activeOpacity={1} onPress={onPress}>
      <InformationButton
        style={{
          position: 'absolute',
          alignItems: 'center',
          top: 10,
          left: 10,
          flexDirection: 'row',
          zIndex: 99,
          elevation: 99,
        }}
        label="tutorial_launch_label"
        onPress={() => minimizeToTutorial()}
      />
      <InstructionText>share_period_details_heading</InstructionText>
      <HeadingText>{'user_input_instructions'}</HeadingText>
      <View
        style={{
          width: '80%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity>
          <ImageBackground
            style={{
              width: 110,
              height: 110,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 50,
              paddingRight: isCalendar ? 0 : 0,
            }}
            resizeMode="contain"
            source={isCalendar ? assets.static.icons.periodFuture : source.notVerifiedDay}
          >
            <CycleCardBodyText>
              {`${inputDay.format('DD')}`}
              {!isCalendar && <RNText>{`\n${translate(inputDay.format('MMM'))}`}</RNText>}
            </CycleCardBodyText>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <Row
        style={{
          marginBottom: 20,
          width: '60%',
        }}
      >
        <TouchableOpacity onPress={onYesPress}>
          <ImageBackground
            style={{
              width: 80,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            resizeMode="contain"
            source={source.period}
          >
            <Text
              style={{
                width: '100%',
                alignItems: 'center',
                textAlign: 'center',
                color: 'white',
                fontSize: 12,
                fontFamily: 'Roboto-Black',
              }}
            >
              Yes
            </Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNoPress}>
          <ImageBackground
            style={{
              width: 80,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            resizeMode="contain"
            source={source.nonPeriod}
          >
            <Text
              style={{
                width: '100%',
                alignItems: 'center',
                textAlign: 'center',
                color: 'white',
                fontSize: 12,
                fontFamily: 'Roboto-Black',
              }}
            >
              No
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </Row>

      <FlowerModal
        isModalVisible={isFlowerVisible}
        onDismiss={() => {
          setFlowerVisible(false)
          hide()
        }}
      />
    </Container>
  )
}

const Container = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`
const Row = styled.View`
  width: 60%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Button = styled.TouchableOpacity`
  height: 85px;
  width: 85px;
  align-items: center;
  justify-content: center;
`

const LongButton = styled.TouchableOpacity`
  height: 90px;
  width: 120px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
`

const InnerText = styled(Text)`
  color: white;
  font-size: 14;
  position: absolute;
  text-align: center;
  font-family: Roboto-Black;
`

const InstructionText = styled(Text)`
  color: white;
  font-size: 13;
  width: 75%;
  margin-top: 50%;
  margin-bottom: 20px;
  text-align: center;
`
const HeadingText = styled(Text)`
  color: white;
  font-size: 19;
  width: 75%;
  margin-bottom: 50px;
  text-align: center;
  font-family: Roboto-Black;
`

const Mask = styled.ImageBackground`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const Column = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const RNText = styled.Text`
  font-family: Roboto-Black;
  font-size: 16;
  text-align: center;
  color: #e3629b;
`

const CycleCardBodyText = styled.Text`
  font-family: Roboto-Black;
  text-align: center;
  color: #e3629b;
  font-size: 16;
`
