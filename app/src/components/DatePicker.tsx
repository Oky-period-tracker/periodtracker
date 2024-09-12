import React from 'react'
import { Calendar, CalendarProps, DateData, LocaleConfig } from 'react-native-calendars'
import { StyleSheet, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DisplayButton } from './Button'
import { MarkedDates } from 'react-native-calendars/src/types'
import { calendarTranslations } from '../resources/translations'
import { useSelector } from 'react-redux'
import { currentLocaleSelector } from '../redux/selectors'
import { Moment } from 'moment'
import { asLocal } from '../services/dateUtils'

LocaleConfig.locales = {
  ...LocaleConfig.locales,
  ...calendarTranslations,
}

export const DatePicker = ({
  selectedDate,
  onDayPress,
}: {
  selectedDate: Moment
  onDayPress: (day: DateData) => void
}) => {
  const locale = useSelector(currentLocaleSelector)
  LocaleConfig.defaultLocale = locale

  const dateString = asLocal(selectedDate).format('YYYY-MM-DD')

  const markedDates: MarkedDates = {
    [dateString]: {
      selected: true,
      selectedColor: '#E3629B',
      selectedTextColor: '#fff',
    },
  }

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        style={styles.calendar}
        theme={theme}
        markedDates={markedDates}
        enableSwipeMonths
        hideExtraDays
        renderArrow={(direction: 'left' | 'right') => {
          return (
            <DisplayButton style={styles.arrowButton}>
              <FontAwesome size={12} name={`arrow-${direction}`} color={'#fff'} />
            </DisplayButton>
          )
        }}
      />
    </View>
  )
}

const theme: CalendarProps['theme'] = {
  monthTextColor: '#f49200',
  textMonthFontSize: 20,
  textMonthFontWeight: 'bold',
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: '100%',
    width: '100%',
    paddingHorizontal: 12,
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
})
