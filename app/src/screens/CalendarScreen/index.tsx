import React, { useState } from 'react'
import { Calendar, CalendarProps, DateData, LocaleConfig } from 'react-native-calendars'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { DisplayButton } from '../../components/Button'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { Text } from '../../components/Text'
import { Modal } from '../../components/Modal'
import { useToggle } from '../../hooks/useToggle'

import {
  useCalculateStatusForDateRange,
  usePredictDay,
  usePredictionEngineState,
} from '../../contexts/PredictionProvider'
import moment from 'moment'
import { asLocal, isFutureDate } from '../../services/dateUtils'
import { DayModal } from '../../components/DayModal'
import { useDispatch, useSelector } from 'react-redux'
import {
  allCardAnswersSelector,
  appTokenSelector,
  currentLocaleSelector,
  currentUserSelector,
  isFuturePredictionSelector,
} from '../../redux/selectors'
import { Hr } from '../../components/Hr'
import { calendarTranslations } from '../../resources/translations'
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'
// import { PredictionState } from '../../prediction'
import { User } from '../../types'
import { httpClient } from '../../services/HttpClient'
import { editUser } from '../../redux/actions'
import { generatePeriodDates } from '../../prediction/predictionLogic'

// TODO: dynamic start & end dates?
const startDate = moment().startOf('day').subtract(24, 'months')
const endDate = moment().startOf('day').add(12, 'months')

LocaleConfig.locales = {
  ...LocaleConfig.locales,
  ...calendarTranslations,
}

export type PeriodDate = {
  date: string
  mlGenerated: boolean
  userVerified: boolean | null
}
const CalendarScreen: ScreenComponent<'Calendar'> = ({ navigation }) => {
  const locale = useSelector(currentLocaleSelector)
  LocaleConfig.defaultLocale = locale

  const [selected, setSelected] = useState('')
  const date = moment(selected)
  const dataEntry = usePredictDay(date)

  const { palette, backgroundColor } = useColor()

  const [choiceModalVisible, toggleChoiceModalVisible] = useToggle()
  const [dayModalVisible, toggleDayModal] = useToggle()

  const [message, setMessage] = React.useState('')
  const predictionFullState = usePredictionEngineState()
  const currentUser = useSelector(currentUserSelector) as User
  const appToken = useSelector(appTokenSelector)
  const reduxDispatch = useDispatch()

  React.useEffect(() => {
    if (!message) {
      return
    }
    const timeout = setTimeout(() => {
      setMessage('')
    }, MESSAGE_DURATION)

    return () => {
      clearTimeout(timeout)
    }
  }, [message])

  React.useEffect(() => {
    if (!currentUser?.metadata?.periodDates?.length) {
      const data = generatePeriodDates(predictionFullState)

      updateUserVerifiedDates({ metadata: { periodDates: data } })
      editUserReduxState({ metadata: { periodDates: data } })
    }
  }, [])
  const toDailyCard = () => {
    toggleChoiceModalVisible()
    navigation.navigate('Day', { date: dataEntry.date })
  }

  const toDayModal = () => {
    toggleChoiceModalVisible()
    toggleDayModal()
  }

  const onDayPress = (day: DateData) => {
    const selectedMoment = asLocal(moment(day.dateString))
    if (isFutureDate(selectedMoment)) {
      setMessage(`too_far_ahead`)
      return
    }
    setSelected(day.dateString)
    toggleChoiceModalVisible()
  }

  const hasFuturePredictionActive = useSelector(isFuturePredictionSelector)
  const verifiedPeriodsData = useSelector((state) =>
    // @ts-expect-error TODO:
    allCardAnswersSelector(state),
  )

  // TODO: this is a massive object that could be reduced via dynamic start & end dates
  const markedDates = useCalculateStatusForDateRange(
    startDate,
    endDate,
    verifiedPeriodsData,
    !!hasFuturePredictionActive?.futurePredictionStatus,
  )

  const messageOpacity = message ? 1 : 0

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

    if (existingDateIndex !== -1) {
      // Step 4: Date exists in array
      const existingEntry = updatedPeriodDates[existingDateIndex]

      if (!existingEntry.mlGenerated && !isPeriodDay) {
        // Remove user-added dates if marked as non-period and not ML-generated
        updatedPeriodDates.splice(existingDateIndex, 1)
      } else {
        // Update userVerified value
        updatedPeriodDates[existingDateIndex] = {
          ...existingEntry,
          userVerified: isPeriodDay,
        }
      }
    } else if (isPeriodDay && !isMlPredicted) {
      // Step 5: Date doesn't exist and isn't ML-predicted, but user marks it as period day
      updatedPeriodDates.push({
        date: periodDate,
        mlGenerated: false,
        userVerified: true,
      })
    }

    // Step 6: Sort by date for consistency
    updatedPeriodDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    try {
      if (updatedPeriodDates) {
        await updateUserVerifiedDates({
          metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
        })

        editUserReduxState({
          metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
        })
      }
    } catch (error) {
      console.error('Error updating period dates:', error)
    }
  }

  const updateUserVerifiedDates = async (changes: Partial<User>) => {
    await httpClient.updateUserVerifiedDays({
      appToken,
      ...changes,
    })
  }

  const editUserReduxState = (changes: Partial<User>) => {
    reduxDispatch(editUser(changes))
  }

  // Usage

  const theme: CalendarProps['theme'] = {
    monthTextColor: palette.secondary.text,
    textMonthFontSize: 26,
    textMonthFontWeight: 'bold',
    calendarBackground: backgroundColor,
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.screen}>
        <View
          style={[styles.messageBoxContainer, globalStyles.shadow, { opacity: messageOpacity }]}
        >
          <View style={[styles.messageBox, globalStyles.elevation, { backgroundColor }]}>
            <Text>{message}</Text>
          </View>
        </View>

        <View style={[styles.container, globalStyles.shadow]}>
          <Calendar
            onDayPress={onDayPress}
            style={[styles.calendar, globalStyles.elevation, { backgroundColor }]}
            theme={theme}
            enableSwipeMonths
            hideExtraDays
            renderArrow={(direction: 'left' | 'right') => {
              return (
                <DisplayButton style={styles.arrowButton}>
                  <FontAwesome size={12} name={`arrow-${direction}`} color={'#fff'} />
                </DisplayButton>
              )
            }}
            markedDates={markedDates}
          />
        </View>

        <Modal
          visible={choiceModalVisible}
          toggleVisible={toggleChoiceModalVisible}
          hideLaunchButton={true}
        >
          <View style={[styles.modalBody, { backgroundColor }]}>
            <TouchableOpacity onPress={toDailyCard} style={styles.confirm}>
              <Text style={styles.confirmText}>to_daily_card</Text>
            </TouchableOpacity>
            <Hr />
            <TouchableOpacity onPress={toDayModal} style={styles.confirm}>
              <Text style={styles.confirmText}>change_period</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <DayModal
          data={dataEntry}
          visible={dayModalVisible}
          toggleVisible={toggleDayModal}
          hideLaunchButton={true}
          onHandleResponse={handleDayModalResponse} // Pass the method as a prop
        />
      </View>
    </View>
  )
}

export default CalendarScreen

const MESSAGE_DURATION = 5000

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    height: '100%',
    width: '100%',
    paddingHorizontal: 12,
    maxWidth: 800,
  },
  container: {
    borderRadius: 20,
    padding: 12,
    overflow: 'hidden',
    maxHeight: 400,
  },
  calendar: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  arrowButton: {
    width: 24,
    height: 24,
  },
  messageBoxContainer: {
    width: '100%',
    alignItems: 'center',
  },
  messageBox: {
    borderRadius: 20,
    width: 160,
    minHeight: 60,
    padding: 12,
  },
  modalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  modalButton: {
    marginBottom: 24,
  },
  confirm: {
    padding: 24,
  },
  confirmText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
