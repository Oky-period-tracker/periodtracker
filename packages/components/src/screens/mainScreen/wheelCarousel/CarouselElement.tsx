import * as React from 'react'
import { View, Image, Dimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import { approximates, runSpring } from 'react-native-redash'
import { DayBadge } from '../../../components/common/DayBadge'
import { DateBadge } from '../../../components/common/DateBadge'
import { assets } from '../../../assets/index'
import { EmojiSelector } from '../../../components/common/EmojiSelector'
import { useSelector } from '../../../hooks/useSelector'
import { emojis } from '../../../config'
import * as selectors from '../../../redux/selectors'
import { useColor } from '../../../hooks/useColor'
import styled from 'styled-components/native'
import moment from 'moment'
import { translate } from '../../../i18n'
import _ from 'lodash'
import { navigateAndReset } from '../../../services/navigationService'
import { ThemedModal } from '../../../components/common/ThemedModal'
import { ColourButtons } from '../ColourButtons'

const {
  Value,
  useCode,
  cond,
  call,
  or,
  eq,
  Clock,
  and,
  set,
  not,
  clockRunning,
  block,
  stopClock,
  interpolate,
} = Animated

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const cardWith = 0.53 * screenWidth
const cardHeight = 0.2 * screenHeight
const cardNames = ['mood', 'body', 'activity', 'flow']

export function CarouselElement({ dataEntry, index, isActive, currentIndex }) {
  const clock = new Clock()
  const value = new Value(0)
  const color = useColor(dataEntry.onPeriod, dataEntry.onFertile)
  const cardAnswersValues = useSelector((state) =>
    selectors.cardAnswerSelector(state, moment(dataEntry.date)),
  )

  const [isVisible, setIsVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  useCode(
    block([
      cond(and(not(isActive), approximates(index, currentIndex)), [
        set(value, runSpring(clock, 0, 1)),
        cond(not(clockRunning(clock)), set(isActive, 0)),
      ]),
      cond(isActive, [stopClock(clock), set(value, 0)]),
    ]),
    [],
  )

  const scale = interpolate(value, { inputRange: [0, 1], outputRange: [1, 1.2] })
  const translation = interpolate(value, { inputRange: [0, 1], outputRange: [0, -10] })
  const navigateToTutorial = () => {
    setLoading(true)
    requestAnimationFrame(() => {
      navigateAndReset('TutorialFirstStack', null)
    })
  }
  const verifiedPeriodDaysData = useSelector((state) =>
    selectors.verifyPeriodDaySelectorWithDate(state, moment(dataEntry.date)),
  )

  return (
    <View
      style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'flex-end' }}
    >
      <AnimatedContainer
        // @ts-ignore
        style={{
          height: cardHeight,
          width: cardWith,
          transform: [{ scale, translateY: translation }],
        }}
      >
        <Row>
          <DayBadge
            fontSizes={{ small: 14, big: 20 }}
            style={{ width: 90, height: 35 }}
            dataEntry={dataEntry}
            cardValues={verifiedPeriodDaysData}
          />
          <DateBadge
            textStyle={{ fontSize: 9 }}
            style={{ width: 55, height: 55 }}
            dataEntry={dataEntry}
            showModal={() => setIsVisible(true)}
            cardValues={verifiedPeriodDaysData}
          />
          {dataEntry.onPeriod ? (
            <Image
              resizeMode="contain"
              source={starImageFill(Object.keys(cardAnswersValues).length)}
              style={{ height: 25, width: 40 }}
            />
          ) : (
            <Empty />
          )}
        </Row>
        <Row>
          {cardNames.map((item, ind) => {
            const isArray = Array.isArray(cardAnswersValues[item])
            const isEmojiActive = isArray
              ? !_.isEmpty(cardAnswersValues[item])
              : !!emojis[cardAnswersValues[item]]
            const emoji = isArray
              ? isEmojiActive
                ? emojis[cardAnswersValues[item][0]]
                : '💁🏻'
              : emojis[cardAnswersValues[item]] || '💁🏻'
            return (
              <EmojiSelector
                color={color}
                key={ind}
                isActive={isEmojiActive}
                style={{
                  height: 38,
                  width: 38,
                  borderRadius: 19,
                }}
                emojiStyle={{ fontSize: 18 }}
                title={translate(item)}
                emoji={emoji}
                textStyle={{ fontSize: 10 }}
              />
            )
          })}
        </Row>
      </AnimatedContainer>
      <ThemedModal {...{ isVisible, setIsVisible }}>
        <ColourButtons
          navigateToTutorial={navigateToTutorial}
          inputDay={dataEntry.date}
          isCalendar={false}
          hide={() => setIsVisible(false)}
          onPress={() => setIsVisible(false)}
          selectedDayInfo={dataEntry}
          cardValues={cardAnswersValues}
        />
      </ThemedModal>
    </View>
  )
}

function starImageFill(numberOfElements) {
  if (numberOfElements === null) return assets.static.icons.starOrange.empty
  if (numberOfElements < 2) return assets.static.icons.starOrange.empty
  if (numberOfElements >= 2 && numberOfElements < 4) return assets.static.icons.starOrange.half
  if (numberOfElements >= 4) return assets.static.icons.starOrange.full
}

const AnimatedContainer = styled(Animated.View)`
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  elevation: 5;
`

const Empty = styled.View`
  height: 25px;
  width: 40px;
`

const Row = styled.View`
  height: 50%;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`
