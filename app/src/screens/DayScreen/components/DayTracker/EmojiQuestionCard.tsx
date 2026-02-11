import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { BadgeSize, EmojiBadge } from '../../../../components/EmojiBadge'
import {
  EmojiCardText,
  emojiOptions,
  offPeriodOptions,
  onPeriodOptions,
} from '../../../../optional/emojis'
import { EmojiQuestionOptions } from './types'
import { useSelector } from '../../../../redux/useSelector'
import { Text } from '../../../../components/Text'
import {
  appTokenSelector,
  cardAnswerSelector,
  currentUserSelector,
  lastPressedEmojiSelector,
} from '../../../../redux/selectors'
import { DayData } from '../../../MainScreen/DayScrollContext'
import { useDispatch } from 'react-redux'
import { answerDailyCard, editUser, updateLastPressedEmojiDate } from '../../../../redux/actions'
import { DayModal } from '../../../../components/DayModal'
import { useToggle } from '../../../../hooks/useToggle'
import { useTranslate } from '../../../../hooks/useTranslate'
import moment from 'moment'
import { firebaseLogEvent } from '../../../../services/firebase'
import { useResponsive } from '../../../../contexts/ResponsiveContext'
import { useColor } from '../../../../hooks/useColor'
import { usePredictionEngineState } from '../../../../contexts/PredictionProvider'
import { generatePeriodDates } from '../../../../prediction/predictionLogic'
import { useCycleCalculation } from '../../../../hooks/useCycleCalculation'
import { httpClient } from '../../../../services/HttpClient'
import { User } from '../../../../types'

export const EmojiQuestionCard = ({
  topic,
  dataEntry,
  size = 'large',
  tutorial = false,
}: {
  topic: keyof EmojiQuestionOptions
  dataEntry?: DayData
  size?: BadgeSize
  mutuallyExclusive?: boolean
  includeDayModal?: boolean
  tutorial?: boolean
}) => {
  const translate = useTranslate()
  const { UIConfig } = useResponsive()
  const { palette, backgroundColor } = useColor()

  // Tutorial styles
  const {
    titleFontSize,
    titleMargin,
    textFontSize,
    questionFontSize,
    questionMargin,
    emojiMargin,
  } = UIConfig.tutorial.emojiCard

  const mutuallyExclusive = topic === 'flow'
  const includeDayModal = topic === 'flow'
  const [dayModalVisible, toggleDayModal] = useToggle()

  const currentUser = useSelector(currentUserSelector) as User
  const userID = currentUser?.id
  const appToken = useSelector(appTokenSelector)
  const predictionFullState = usePredictionEngineState()
  const { updateCycleCount } = useCycleCalculation()

  const selectedEmojis = dataEntry
    ? useSelector((state) => cardAnswerSelector(state, dataEntry?.date))
    : {}

  const dispatch = useDispatch()
  const lastClickedDate = useSelector(lastPressedEmojiSelector)

  const onEmojiPress = (answer: string) => {
    if (!userID || !dataEntry) {
      return
    }
    const todayDate = moment().format('YYYY-MM-DD')

    if (lastClickedDate !== todayDate) {
      dispatch(updateLastPressedEmojiDate(todayDate))
      firebaseLogEvent('dailyCardAnsweredEmoji')
    }

    dispatch(
      answerDailyCard({
        cardName: topic,
        // @ts-expect-error TODO:
        answer,
        userID,
        utcDateTime: dataEntry.date,
        mutuallyExclusive,
        periodDay: dataEntry.onPeriod,
      }),
    )

    if (!includeDayModal) {
      return
    }

    if (dataEntry?.onPeriod && offPeriodOptions.includes(answer)) {
      toggleDayModal()
    }

    if (!dataEntry?.onPeriod && onPeriodOptions.includes(answer)) {
      toggleDayModal()
    }
  }

  const handleDayModalResponse = async (isPeriodDay: boolean, periodDate: string) => {
    const predictedPeriodDates = generatePeriodDates(predictionFullState)

    let updatedPeriodDates = currentUser.metadata?.periodDates
      ? [...currentUser.metadata.periodDates]
      : []

    const mlDatesToAdd = predictedPeriodDates
      .filter((entry) => !updatedPeriodDates.some((u) => u.date === entry.date))
      .map((entry) => ({
        ...entry,
        mlGenerated: false,
        userVerified: entry.userVerified || false,
      }))
    updatedPeriodDates = [...updatedPeriodDates, ...mlDatesToAdd]

    const isMlPredicted = predictedPeriodDates.some((entry) => entry.date === periodDate)
    const existingDateIndex = updatedPeriodDates.findIndex((entry) => entry.date === periodDate)

    let shouldRecalculateCycles = false

    if (isPeriodDay) {
      if (existingDateIndex !== -1) {
        const existingEntry = updatedPeriodDates[existingDateIndex]
        if (existingEntry.userVerified === true) {
          return
        } else {
          updatedPeriodDates[existingDateIndex] = {
            ...existingEntry,
            userVerified: true,
            mlGenerated: false,
          }
          shouldRecalculateCycles = true
        }
      } else {
        updatedPeriodDates.push({
          date: periodDate,
          mlGenerated: isMlPredicted,
          userVerified: true,
        })
        shouldRecalculateCycles = true
      }
    } else {
      if (existingDateIndex !== -1) {
        const existingEntry = updatedPeriodDates[existingDateIndex]
        if (existingEntry.userVerified === true) {
          updatedPeriodDates.splice(existingDateIndex, 1)
          shouldRecalculateCycles = true
        } else {
          updatedPeriodDates.splice(existingDateIndex, 1)
        }
      } else {
        return
      }
    }

    updatedPeriodDates.sort((a, b) => {
      const dateA = moment(a.date, ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'], true)
      const dateB = moment(b.date, ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'], true)
      return dateA.valueOf() - dateB.valueOf()
    })

    // Update local state first (optimistic) so locks unlock immediately
    dispatch(editUser({
      metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
    }))

    if (shouldRecalculateCycles) {
      await updateCycleCount(updatedPeriodDates)
    }

    // Sync to server in the background (failure won't block local state)
    if (appToken) {
      try {
        await httpClient.updateUserVerifiedDays({
          appToken,
          metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
        })
      } catch (error) {
        console.error('Error syncing period dates to server:', error)
      }
    }
  }

  const options = Object.entries(emojiOptions[topic])
  const { title, description, question } = EmojiCardText[topic]

  return (
    <View style={[styles.page, { backgroundColor }]}>
      <Text
        style={[
          styles.title,
          { color: palette.secondary.text },
          tutorial && {
            fontSize: titleFontSize,
            marginBottom: titleMargin,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={
          tutorial && {
            fontSize: textFontSize,
          }
        }
      >
        {description}
      </Text>
      <Text
        style={[
          styles.question,
          { color: palette.secondary.text },
          tutorial && {
            marginTop: questionMargin,
            marginBottom: questionMargin,
            fontSize: questionFontSize,
          },
        ]}
      >
        {question}
      </Text>
      <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.emojiContainer}>
          {options.map(([key, emoji]) => {
            const isSelected = selectedEmojis[topic]?.includes?.(key)
            const status = isSelected ? 'neutral' : 'basic'
            const onPress = () => {
              onEmojiPress(key)
            }

            const text = translate(key)

            return (
              <EmojiBadge
                key={key}
                onPress={onPress}
                emoji={emoji}
                text={text}
                status={status}
                size={size}
                style={[styles.emojiBadge, tutorial && { marginVertical: emojiMargin }]}
              />
            )
          })}
        </ScrollView>
      </View>
      {includeDayModal && dataEntry && (
        <DayModal
          visible={dayModalVisible}
          toggleVisible={toggleDayModal}
          data={dataEntry}
          hideLaunchButton={false}
          onHandleResponse={handleDayModalResponse}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    padding: 24,
    maxWidth: 800,
    borderRadius: 20,
  },
  button: {
    marginLeft: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
  },

  emojiBadge: {
    flexBasis: '30%',
    marginVertical: 12,
  },
})
