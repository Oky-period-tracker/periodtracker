// app/src/screens/CalendarScreen/CalendarLegend.tsx
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useColor } from '../../hooks/useColor'
import { useTranslate } from '../../hooks/useTranslate'
import { DayKind, PredictionStatus } from '../../prediction/calendarMarks'
import { legendKeys } from './calendarText'

export const CalendarLegend = ({
  days,
  status,
}: {
  days: Record<string, DayKind[]>
  status: PredictionStatus
}) => {
  const { calendar: c } = useColor()
  const t = useTranslate()
  const swatch: Record<string, object> = {
    calendar_legend_confirmed: { backgroundColor: c.confirmed },
    calendar_legend_possible_period: { backgroundColor: c.periodWash },
    calendar_legend_likely_start: { borderColor: c.ring, borderWidth: 2.5 },
    calendar_legend_ovulation: { backgroundColor: c.ovulationWash },
    calendar_legend_today: {},
  }
  return (
    <View style={styles.list}>
      {legendKeys(days, status).map((key) => (
        <View key={key} style={styles.row}>
          <View style={[styles.swatch, swatch[key]]}>
            {key === 'calendar_legend_today' && (
              <View style={[styles.dot, { backgroundColor: c.todayDot }]} />
            )}
          </View>
          <Text style={[styles.label, { color: c.legendText }]}>{t(key)}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  list: { marginTop: 16, marginHorizontal: 6, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  swatch: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'flex-end' },
  dot: { width: 5, height: 5, borderRadius: 2.5, marginBottom: 2 },
  label: { fontSize: 15 },
})
