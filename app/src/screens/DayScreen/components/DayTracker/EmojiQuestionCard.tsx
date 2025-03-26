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
  cardAnswerSelector,
  currentUserSelector,
  lastPressedEmojiSelector,
} from '../../../../redux/selectors'
import { DayData } from '../../../MainScreen/DayScrollContext'
import { useDispatch } from 'react-redux'
import { answerDailyCard, updateLastPressedEmojiDate } from '../../../../redux/actions'
import { DayModal } from '../../../../components/DayModal'
import { useToggle } from '../../../../hooks/useToggle'
import { useTranslate } from '../../../../hooks/useTranslate'
import moment from 'moment'
import { analytics } from '../../../../services/firebase'
import { useResponsive } from '../../../../contexts/ResponsiveContext'
import { useColor } from '../../../../hooks/useColor'

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

  const userID = useSelector(currentUserSelector)?.id

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
      analytics?.().logEvent('dailyCardAnsweredEmoji')
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
            // @ts-expect-error TODO:
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
