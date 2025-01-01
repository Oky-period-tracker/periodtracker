import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useTutorial } from '../TutorialContext'
import Cloud from '../../../components/icons/Cloud'
import { Text } from '../../../components/Text'
import { DatePicker } from '../../../components/DatePicker'
import { NotesCard } from '../../DayScreen/components/DayTracker/NotesCard'
import { useScreenDimensions } from '../../../hooks/useScreenDimensions'
import { EmojiQuestionCard } from '../../DayScreen/components/DayTracker/EmojiQuestionCard'
import { LocaleConfig } from 'react-native-calendars'
import { calendarTranslations } from '../../../resources/translations'
import { useSelector } from '../../../redux/useSelector'
import { currentLocaleSelector } from '../../../redux/selectors'
import { CloudOutline } from '../../../components/icons/CloudOutline'
import moment from 'moment'
import { globalStyles } from '../../../config/theme'
import { useResponsive } from '../../../contexts/ResponsiveContext'

export const TutorialFeature = () => {
  const { state, stepConfig } = useTutorial()

  if (!state.isPlaying || !stepConfig || !stepConfig.feature) {
    return null
  }

  const Feature = stepConfig.feature

  return <Feature />
}

export const CloudColors = () => {
  return (
    <View style={styles.clouds}>
      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>period</Text>
        <Cloud status={'danger'} />
      </View>

      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>ovulation</Text>
        <Cloud status={'tertiary'} />
      </View>

      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>non_period</Text>
        <Cloud status={'neutral'} />
      </View>
    </View>
  )
}

export const CloudPrediction = () => {
  return (
    <View style={styles.clouds}>
      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>unverified_button</Text>
        <CloudOutline status={'danger'} />
      </View>

      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>period</Text>
        <Cloud status={'danger'} />
      </View>

      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>non_period</Text>
        <Cloud status={'neutral'} />
      </View>
    </View>
  )
}

LocaleConfig.locales = {
  ...LocaleConfig.locales,
  ...calendarTranslations,
}

export const CalendarFeature = () => {
  const locale = useSelector(currentLocaleSelector)
  LocaleConfig.defaultLocale = locale

  return (
    <View style={[styles.calendarContainer, globalStyles.shadow]}>
      <DatePicker
        selectedDate={moment()}
        onDayPress={() => {
          //
        }}
      />
    </View>
  )
}

export const ActivityCardFeature = () => {
  const { width } = useScreenDimensions()
  const { UIConfig } = useResponsive()

  // Tutorial styles
  const { badgeSize } = UIConfig.tutorial.emojiCard

  const aspectRatio = 0.75
  const w = width - 60 - 24 - 24 - 24
  const h = w / aspectRatio

  return (
    <View style={[styles.notesCard, globalStyles.shadow, { width: w, height: h }]}>
      <EmojiQuestionCard topic={'activity'} size={badgeSize} tutorial={true} />
    </View>
  )
}

export const NotesFeature = () => {
  const { width } = useScreenDimensions()

  const aspectRatio = 0.75
  const w = width - 60 - 24 - 24 - 24
  const h = w / aspectRatio

  return (
    <View style={[styles.notesCard, globalStyles.shadow, { width: w, height: h }]}>
      <NotesCard />
    </View>
  )
}

const styles = StyleSheet.create({
  clouds: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
  },
  cloudColumn: {
    width: 80 + 16,
    margin: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cloudText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  calendarContainer: {
    position: 'absolute',
    top: 80,
  },
  notesCard: {
    position: 'absolute',
    top: 150,
    left: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
  },
})
