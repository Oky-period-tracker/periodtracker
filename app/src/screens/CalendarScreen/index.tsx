import React, { useState } from 'react'
import { Calendar, CalendarProps, DateData, LocaleConfig } from 'react-native-calendars'
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { DisplayButton } from '../../components/Button'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { Text } from '../../components/Text'
import { Modal } from '../../components/Modal'
import { useToggle } from '../../hooks/useToggle'
import { usePredictDay } from '../../contexts/PredictionProvider'
import moment from 'moment'
import { asLocal, isFutureDate } from '../../services/dateUtils'
import { DayModal } from '../../components/DayModal'
import { useSelector } from 'react-redux'
import { currentLocaleSelector } from '../../redux/selectors'
import { Hr } from '../../components/Hr'
import { calendarTranslations } from '../../resources/translations'
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'
import { usePeriodDateUpdate } from '../../hooks/usePeriodDateUpdate'
import { CalendarDay } from '../../components/CalendarDay'
import { useCalendarMarks } from '../../hooks/useCalendarMarks'
import { PredictionMessage } from './PredictionMessage'
import { CalendarLegend } from './CalendarLegend'

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

  const { backgroundColor, calendar } = useColor()

  const [choiceModalVisible, toggleChoiceModalVisible] = useToggle()
  const [dayModalVisible, toggleDayModal] = useToggle()
  const [pendingDayModal, setPendingDayModal] = useState(false)

  const [message, setMessage] = React.useState('')
  const { handleDayModalResponse, initPeriodDatesIfEmpty } = usePeriodDateUpdate()

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
    initPeriodDatesIfEmpty()
  }, [])
  const toDailyCard = () => {
    toggleChoiceModalVisible()
    navigation.navigate('Day', { date: dataEntry.date })
  }

  const toDayModal = () => {
    toggleChoiceModalVisible()
    if (Platform.OS === 'android') {
      toggleDayModal()
    } else {
      setPendingDayModal(true)
    }
  }

  const onChoiceModalDismiss = () => {
    if (pendingDayModal) {
      setPendingDayModal(false)
      toggleDayModal()
    }
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

  const { markedDates, marks, predictionsEnabled } = useCalendarMarks()

  const messageOpacity = message ? 1 : 0

  const theme: CalendarProps['theme'] = {
    monthTextColor: calendar.monthTitle,
    textMonthFontSize: 26,
    textMonthFontWeight: 'bold',
    textSectionTitleColor: calendar.weekday,
    calendarBackground: backgroundColor,
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
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
            // custom marking fields (kinds, label, isToday) are read by CalendarDay
            markedDates={markedDates as unknown as CalendarProps['markedDates']}
            dayComponent={CalendarDay as unknown as CalendarProps['dayComponent']}
          />
        </View>
        {predictionsEnabled && <PredictionMessage status={marks.status} />}
        <CalendarLegend days={marks.days} status={marks.status} />

        <Modal
          visible={choiceModalVisible}
          toggleVisible={toggleChoiceModalVisible}
          hideLaunchButton={true}
          onDismiss={onChoiceModalDismiss}
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
          hideLaunchButton={false}
          onHandleResponse={handleDayModalResponse} // Pass the method as a prop
          onLaunchTutorial={() => navigation.navigate('Home', { tutorial: 'tutorial_one' })}
        />
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 24,
  },
  container: {
    borderRadius: 20,
    padding: 12,
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
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
