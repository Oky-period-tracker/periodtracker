import React from 'react'
import { Image } from 'react-native'
import { CalendarList as DefaultCalendarList, LocaleConfig } from 'react-native-calendars'
import momentTimezone from 'moment-timezone'
import { assets } from '../../assets/index'
import { useSelector } from '../../redux/useSelector'
import * as selectors from '../../redux/selectors'
import { calendarTranslations } from '@oky/core'

LocaleConfig.locales = {
  ...LocaleConfig.locales,
  ...calendarTranslations,
}

export function CalendarList({
  handleMonthChange,
  currentMonth = momentTimezone().format(),
  highlightedDates = {},
  setInputDay,
  width = null,
}: any) {
  const locale = useSelector(selectors.currentLocaleSelector)
  LocaleConfig.defaultLocale = locale
  const [markedDates, setMarkedDates] = React.useState({})
  const calendarRef = React.useRef()

  React.useEffect(() => {
    setMarkedDates(highlightedDates)
  }, [highlightedDates])

  const arrowFunctiions =
    typeof handleMonthChange !== 'undefined'
      ? {
          current: currentMonth,
          onPressArrowLeft: () => handleMonthChange('sub'),
          onPressArrowRight: () => handleMonthChange('add'),
        }
      : {}
  return (
    <DefaultCalendarList
      {...arrowFunctiions}
      ref={calendarRef}
      initialNumToRender={3}
      theme={{
        monthTextColor: '#f49200',
        textMonthFontSize: 20,
        textMonthFontFamily: 'Roboto-Black',
        // @ts-ignore
        'stylesheet.day.period': {
          base: {
            overflow: 'hidden',
            height: 34,
            alignItems: 'center',
            width: 38,
          },
          today: {
            backgroundColor: '#f49200',
          },
          todayText: {
            fontWeight: '700',
            color: 'white',
          },
        },
      }}
      horizontal={true} // Enable paging on horizontal
      pagingEnabled={true}
      renderArrow={(direction) => {
        if (direction === 'left')
          return <Image source={assets.static.icons.back} style={{ height: 20, width: 20 }} />
        return (
          <Image
            source={assets.static.icons.back}
            style={{ height: 20, width: 20, transform: [{ scaleX: -1 }] }}
          />
        )
      }}
      pastScrollRange={24} // months
      futureScrollRange={12} // months
      calendarWidth={width || 340}
      onDayPress={(day) => {
        const userTimeZone = momentTimezone.tz.guess()
        momentTimezone.tz.setDefault(userTimeZone)
        // setInputDay(momentTimezone(dateData).tz('America/Santiago', true))
        setInputDay(momentTimezone(day.dateString).startOf('day'))
      }}
      markedDates={markedDates}
      markingType={'custom'}
      hideArrows={false}
    />
  )
}
