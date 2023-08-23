import React from 'react'
import { Image } from 'react-native'
import { CalendarList as DefaultCalendarList, LocaleConfig } from 'react-native-calendars'
import momentTimezone from 'moment-timezone'
import { assets } from '../../assets/index'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'

LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Ma', 'Ap', 'Ma', 'Ju', 'Jul', 'Au', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
}

LocaleConfig.locales.fr = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv',
    'Févr',
    'Mars',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Août',
    'Sept',
    'Oct',
    'Nov',
    'Déc',
  ],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
}

LocaleConfig.locales.pt = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
}

LocaleConfig.locales.ru = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн ',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
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
