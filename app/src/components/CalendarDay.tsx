// app/src/components/CalendarDay.tsx
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useColor } from '../hooks/useColor'
import { DayKind } from '../prediction/calendarMarks'

export const DAY_SIZE = 36

export type CalendarDayMarking = { kinds?: DayKind[]; isToday?: boolean; label?: string }

type DayDate = { dateString: string; day: number }

type Props = {
  date?: DayDate
  marking?: CalendarDayMarking
  onPress?: (date: DayDate) => void
}

// A square rotated 45° whose edge runs through the circle's centre covers the top-left half.
const SPLIT_SIDE = DAY_SIZE * 1.5
const SPLIT_OFFSET = DAY_SIZE / 2 - SPLIT_SIDE / 2 / Math.SQRT2 - SPLIT_SIDE / 2

export const CalendarDay = ({ date, marking, onPress }: Props) => {
  const { calendar: c } = useColor()
  if (!date) return <View style={styles.cell} />

  const kinds = marking?.kinds ?? []
  const has = (k: DayKind) => kinds.includes(k)
  const look = has('confirmed')
    ? 'confirmed'
    : has('likelyStart')
      ? 'likelyStart'
      : has('possiblePeriod') && has('ovulation')
        ? 'split'
        : has('possiblePeriod')
          ? 'possiblePeriod'
          : has('ovulation')
            ? 'ovulation'
            : 'plain'

  const fill = {
    confirmed: { backgroundColor: c.confirmed },
    likelyStart: { backgroundColor: c.ringCenter, borderColor: c.ring, borderWidth: 3 },
    split: { backgroundColor: c.ovulationWash },
    possiblePeriod: { backgroundColor: c.periodWash },
    ovulation: { backgroundColor: c.ovulationWash },
    plain: {},
  }[look]
  const textColor = {
    confirmed: c.confirmedText,
    likelyStart: c.ringText,
    split: c.periodText,
    possiblePeriod: c.periodText,
    ovulation: c.ovulationText,
    plain: c.dayText,
  }[look]
  const bold = look !== 'ovulation' && look !== 'plain'

  return (
    <TouchableOpacity
      style={styles.cell}
      onPress={() => onPress?.(date)}
      accessibilityRole="button"
      accessibilityLabel={marking?.label ?? date.dateString}
    >
      <View testID="calendar-day-circle" style={[styles.circle, fill]}>
        {look === 'split' && (
          <View
            testID="calendar-day-split"
            style={[styles.split, { backgroundColor: c.periodWash }]}
          />
        )}
        <Text
          style={[
            styles.number,
            { color: textColor },
            (bold || marking?.isToday) && styles.bold,
            marking?.isToday && look === 'plain' && styles.lifted,
          ]}
        >
          {date.day}
        </Text>
        {marking?.isToday && (
          <View
            testID="calendar-day-today-dot"
            style={[
              styles.dot,
              { backgroundColor: look === 'confirmed' ? c.confirmedText : c.todayDot },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cell: { width: DAY_SIZE + 4, height: DAY_SIZE + 4, alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  split: {
    position: 'absolute',
    width: SPLIT_SIDE,
    height: SPLIT_SIDE,
    left: SPLIT_OFFSET,
    top: SPLIT_OFFSET,
    transform: [{ rotate: '45deg' }],
  },
  number: { fontSize: 16, fontWeight: '500' },
  bold: { fontWeight: '800' },
  lifted: { transform: [{ translateY: -3 }] },
  dot: { position: 'absolute', bottom: 4, width: 5, height: 5, borderRadius: 2.5 },
})
