import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DisplayButton } from './Button'
import { EmojiBadge } from './EmojiBadge'
import { IconButton } from './IconButton'
import { DayData, useDayScroll } from '../screens/MainScreen/DayScrollContext'
import { useSelector } from '../redux/useSelector'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import {
  cardAnswerSelector,
  currentThemeSelector,
  isTutorialTwoActiveSelector,
  lastPressedCardSelector,
} from '../redux/selectors'
import { useNavigation } from '@react-navigation/native'
import { defaultEmoji } from '../config/options'
import { globalStyles } from '../config/theme'
import { useTutorial } from '../screens/MainScreen/TutorialContext'
import { useLoading } from '../contexts/LoadingProvider'
import { useAvatarMessage } from '../contexts/AvatarMessageContext'
import { isFutureDate } from '../services/dateUtils'
import { useDayStatus } from '../hooks/useDayStatus'
import { ThemeName } from '../resources/translations'
import { useTranslate } from '../hooks/useTranslate'
import { useFormatDate } from '../hooks/useFormatDate'
import { analytics } from '../services/firebase'
import { updateLastPressedCardDate } from '../redux/actions'
import { useColor } from '../hooks/useColor'
import { emojiOptions } from '../optional/emojis'

interface DailyCardProps {
  dataEntry: DayData
  disabled?: boolean
}

// TODO: Move
const IconSizeForTheme: Record<ThemeName, number> = {
  hills: 80,
  mosaic: 60,
  village: 80,
  desert: 60,
}

export const DailyCard = ({ dataEntry, disabled }: DailyCardProps) => {
  const { setLoading } = useLoading()
  const { setAvatarMessage } = useAvatarMessage()
  const { formatMomentDayMonth } = useFormatDate()
  const translate = useTranslate()
  const { dispatch: tutorialDispatch } = useTutorial()
  const { isDragging, constants } = useDayScroll()
  const { CARD_WIDTH, CARD_MARGIN } = constants
  const { backgroundColor, starColor } = useColor()

  const { status, appearance } = useDayStatus(dataEntry)

  const theme = useSelector(currentThemeSelector)
  const IconSize = IconSizeForTheme[theme] ?? 80

  const isTutorialTwoActive = useSelector(isTutorialTwoActiveSelector)

  const cardAnswersValues = useSelector((state) =>
    cardAnswerSelector(state, moment(dataEntry.date)),
  )

  // eslint-disable-next-line
  const navigation = useNavigation() as any // @TODO: Fixme
  const dispatch = useDispatch()
  const lastPressedDate = useSelector(lastPressedCardSelector)

  const onPress = () => {
    if (isDragging?.current) {
      return
    }

    if (isTutorialTwoActive) {
      setLoading(true, 'please_wait_tutorial')
      tutorialDispatch({ type: 'start', value: 'tutorial_two' })
      return
    }

    if (isFutureDate(dataEntry.date)) {
      setAvatarMessage('carousel_no_access', true)
      return
    }

    const todayDate = moment().format('YYYY-MM-DD')
    if (lastPressedDate !== todayDate) {
      dispatch(updateLastPressedCardDate(todayDate))
      analytics?.().logEvent('dailyCardPressed')
    }

    navigation.navigate('Day', { date: dataEntry.date })
  }

  const day = dataEntry.cycleDay === 0 ? '-' : dataEntry.cycleDay
  const dayText = `${translate('Day')} ${day}`

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.card,
        globalStyles.shadow,
        {
          width: CARD_WIDTH,
          marginHorizontal: CARD_MARGIN / 2,
          backgroundColor,
        },
      ]}
    >
      <View style={styles.top}>
        <DisplayButton
          status={status}
          appearance={appearance}
          textStyle={styles.dayText}
          style={{ width: CARD_WIDTH / 3 }}
          enableTranslate={false}
        >
          {dayText}
        </DisplayButton>
        <IconButton
          status={status}
          appearance={appearance}
          text={formatMomentDayMonth(dataEntry.date)}
          size={IconSize}
          disabled
        />
        <FontAwesome
          name={getStar(Object.keys(cardAnswersValues).length)}
          color={starColor}
          size={28}
        />
      </View>

      <View style={styles.bottom}>
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

          const text = translate(key)

          return (
            <EmojiBadge
              key={`${dataEntry.date}-${key}`}
              emoji={emoji}
              text={text}
              status={isEmojiActive ? status : 'basic'}
              disabled
            />
          )
        })}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    aspectRatio: 1.5,
    flexDirection: 'column',
    padding: 8,
    margin: 24,
  },
  top: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  iconRight: {
    height: 24,
    width: 24,
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})

const getStar = (numberOfElements: number) => {
  if (numberOfElements === null) return 'star-o'
  if (numberOfElements < 2) return 'star-o'
  if (numberOfElements >= 2 && numberOfElements < 4) return 'star-half-full'
  if (numberOfElements >= 4) return 'star'
}
