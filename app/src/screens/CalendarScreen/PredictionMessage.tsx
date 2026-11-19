// app/src/screens/CalendarScreen/PredictionMessage.tsx
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useColor } from '../../hooks/useColor'
import { useTranslate } from '../../hooks/useTranslate'
import { useFormatDate } from '../../hooks/useFormatDate'
import { PredictionStatus } from '../../prediction/calendarMarks'
import { messageText } from './calendarText'

export const PredictionMessage = ({ status }: { status: PredictionStatus }) => {
  const { calendar: c } = useColor()
  const t = useTranslate()
  const { formatDayFullMonth } = useFormatDate()
  const { title, body } = messageText(status, t, formatDayFullMonth)
  return (
    <View style={[styles.box, { backgroundColor: c.messageBackground }]} accessibilityRole="summary">
      <Text style={[styles.title, { color: c.messageTitle }]}>{title}</Text>
      <Text style={[styles.body, { color: c.messageBody }]}>{body}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  box: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, marginTop: 16 },
  title: { fontSize: 15, fontWeight: '800', lineHeight: 22 },
  body: { fontSize: 15, lineHeight: 22, marginTop: 2 },
})
