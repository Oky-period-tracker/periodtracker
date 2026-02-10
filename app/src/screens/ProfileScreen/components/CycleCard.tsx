import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { EmojiBadge } from '../../../components/EmojiBadge'
import { useSelector } from '../../../redux/useSelector'
import { mostAnsweredSelector } from '../../../redux/selectors'
import { defaultEmoji } from '../../../config/options'
import { Moment } from 'moment'
import { Text } from '../../../components/Text'
import { useMonths } from '../../../hooks/useMonths'
import { useTranslate } from '../../../hooks/useTranslate'
import { globalStyles } from '../../../config/theme'
import { useColor } from '../../../hooks/useColor'
import { emojiOptions } from '../../../optional/emojis'

export const CycleCard = ({
  item,
  cycleNumber,
  navigation,
}: {
  item: {
    cycleStartDate: Moment
    cycleEndDate: Moment
    periodLength: number
    cycleLength: number
  }
  cycleNumber: number
  navigation?: any
}) => {
  const { palette, backgroundColor } = useColor()
  const { months } = useMonths()
  const translate = useTranslate()
  
  // Memoize the date strings to create stable dependencies
  const startDateStr = React.useMemo(() => item.cycleStartDate.format('YYYYMMDD'), [item.cycleStartDate])
  const endDateStr = React.useMemo(() => item.cycleEndDate.format('YYYYMMDD'), [item.cycleEndDate])
  
  // Get the selector result
  const selectorResult = useSelector((state) =>
    mostAnsweredSelector(state, item.cycleStartDate, item.cycleEndDate),
  )
  
  // Memoize the result to prevent returning new object references when values haven't changed
  const cardAnswersValues = React.useMemo(() => {
    return selectorResult
  }, [
    selectorResult.mood,
    selectorResult.body,
    selectorResult.activity,
    selectorResult.flow,
    startDateStr,
    endDateStr,
  ])

  const startDay = item.cycleStartDate.format('DD')
  const startMonthIndex = parseInt(item.cycleStartDate.format('M')) - 1
  const startMonth = months[startMonthIndex]

  const endDay = item.cycleEndDate.format('DD')
  const endMonthIndex = parseInt(item.cycleEndDate.format('M')) - 1
  const endMonth = months[endMonthIndex]

  const periodEndDate = item.cycleStartDate.clone().add(item.periodLength, 'days')

  const periodEndDay = periodEndDate.format('DD')
  const periodEndMonthIndex = parseInt(periodEndDate.format('M')) - 1
  const periodEndMonth = months[periodEndMonthIndex]

  const goToCalendar = () => {
    if (!navigation) return
    
    const parent = navigation.getParent()
    if (parent) {
      parent.navigate('home', { screen: 'Calendar' })
    } else {
      navigation.navigate('home' as any, { screen: 'Calendar' })
    }
  }

  return (
    <TouchableOpacity 
      style={[styles.container, globalStyles.shadow]} 
      testID="cycle"
      onPress={goToCalendar}
      activeOpacity={0.7}
    >
      <View style={[styles.cycleCard, { backgroundColor }]}>
        {/* ===== Header ===== */}
        <View style={[styles.cycleCardHeader, { backgroundColor: palette.danger.base }]}>
          <View style={styles.row}>
            <Text style={styles.headerText}>cycle</Text>
            <Text
              enableTranslate={false}
              style={[styles.headerText, styles.bold]}
            >{` ${cycleNumber}`}</Text>
          </View>

          <View style={styles.row}>
            <Text enableTranslate={false} style={[styles.headerText, styles.bold]}>
              {`${item.cycleLength} `}
            </Text>
            <Text style={styles.headerText}>day_cycle</Text>
          </View>

          <View style={styles.row}>
            <Text enableTranslate={false} style={[styles.headerText, styles.bold]}>
              {startDay}
            </Text>
            <Text enableTranslate={false} style={styles.headerText}>{` ${startMonth} - `}</Text>
            <Text enableTranslate={false} style={[styles.headerText, styles.bold]}>
              {endDay}
            </Text>
            <Text enableTranslate={false} style={styles.headerText}>{` ${endMonth}`}</Text>
          </View>
        </View>

        {/* ===== Body ===== */}
        <View style={styles.cycleCardBody}>
          <View style={styles.cycleCardBodyLeft}>
            <Text>
              <Text enableTranslate={false} style={styles.bold}>
                {`${item.periodLength} `}
              </Text>
              <Text>day_period</Text>
            </Text>

            <Text>
              <Text enableTranslate={false} style={styles.bold}>
                {startDay}
              </Text>
              <Text enableTranslate={false}>{` ${startMonth} - `}</Text>
              <Text enableTranslate={false} style={styles.bold}>
                {periodEndDay}
              </Text>
              <Text enableTranslate={false}>{` ${periodEndMonth}`}</Text>
            </Text>
          </View>
          <View style={styles.cycleCardBodyRight}>
            {Object.entries(emojiOptions).map(([key]) => {
              // @ts-expect-error TODO:
              const isArray = Array.isArray(cardAnswersValues[key])

              const isEmojiActive = isArray
                ? // @ts-expect-error TODO:
                  cardAnswersValues[key]?.length > 0
                : // @ts-expect-error TODO:
                  !!cardAnswersValues[key]

              const answer = isEmojiActive
                ? isArray
                  ? // @ts-expect-error TODO:
                    cardAnswersValues[key][0]
                  : // @ts-expect-error TODO:
                    cardAnswersValues[key]
                : ''

              const emoji = isEmojiActive
                ? // @ts-expect-error TODO:
                  emojiOptions[key][answer]
                : defaultEmoji

              return (
                <EmojiBadge
                  key={`${item.cycleStartDate}-${key}`}
                  emoji={emoji}
                  text={translate(key)}
                  status={isEmojiActive ? 'danger' : 'basic'}
                  size={'small'}
                  disabled
                />
              )
            })}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: '100%',
    height: 140,
    marginVertical: 4,
  },
  cycleCard: {
    borderRadius: 20,
    width: '100%',
    height: 140,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cycleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: ' 33%',
    paddingHorizontal: 16,
  },
  headerText: {
    color: '#fff',
  },
  cycleCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    padding: 10,
  },
  cycleCardBodyLeft: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    flexBasis: '45%',
  },
  cycleCardBodyRight: {
    flexBasis: '55%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
  },
  bold: {
    fontWeight: 'bold',
  },
})
