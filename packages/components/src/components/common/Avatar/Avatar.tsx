import React from 'react'
import { TouchableOpacity, Image, Animated, Easing, Platform } from 'react-native'
import LottieView from 'lottie-react-native'
import { assets } from '../../../assets/index'
import { ProgressBar } from './ProgressBar'
import { Text, TextWithoutTranslation } from '../Text'
import { FloatingQuestion } from './FloatingQuestion'
import styled from 'styled-components/native'
import { Icon } from '../Icon'
import { HeartAnimation } from './HeartAnimation'
import { useSelector } from '../../../hooks/useSelector'
import * as selectors from '../../../redux/common/selectors/index'
import moment from 'moment'
import { useDisplayText } from '../../context/DisplayTextContext'
import { useTodayPrediction } from '../../context/PredictionProvider'

const lookingAndWave = { start: 0, end: 8 / 30, duration: 6500 }
const looking = { start: 0, end: 4 / 30, duration: 4000 }
const wave = { start: 4 / 30, end: 8 / 30, duration: 4000 }
const jump = { start: 8 / 30, end: 10 / 30, duration: 2200 }
const danceOne = { start: 10 / 30, end: 15 / 30, duration: 4000 }
const danceTwo = { start: 15 / 30, end: 20 / 30, duration: 4000 }
const danceThree = { start: 20 / 30, end: 25 / 30, duration: 5000 }
const danceFour = { start: 25 / 30, end: 30 / 30, duration: 5000 }

export function Avatar({
  style = null,
  isProgressVisible = true,
  textShown = '',
  disable = false,
  alertTextVisible = true,
  stationary = false,
  avatarStyle = null,
}) {
  const { text: displayedText, hideDisplayText } = useDisplayText()
  const [animatedHearts, setAnimatedHearts] = React.useState(0)
  const isJumpingToggled = React.useRef(false)
  const isDancingToggled = React.useRef(false)
  const randomDance = React.useRef(1)
  const selectedAvatar = useSelector(selectors.currentAvatarSelector)
  const [animatedProgress] = React.useState(new Animated.Value(0))

  const { onPeriod } = useTodayPrediction()
  const cardAnswersToday = useSelector((state) => selectors.cardAnswerSelector(state, moment.utc()))
  React.useEffect(() => {
    const intervalId = setTimeout(hideDisplayText, 3000)
    return () => {
      clearTimeout(intervalId)
    }
  }, [displayedText])

  React.useEffect(() => {
    if (animatedHearts * 5 >= 100) {
      isDancingToggled.current = true
    }
  }, [animatedHearts])

  React.useEffect(() => {
    runLookingAnimation()
  }, [])

  const runLookingAnimation = () => {
    Animated.sequence([
      Animated.timing(animatedProgress, {
        toValue: 0,
        duration: 0,
        delay: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedProgress, {
        toValue: lookingAndWave.end,
        duration: lookingAndWave.duration,
        useNativeDriver: true,
      }),
      Animated.timing(animatedProgress, {
        toValue: lookingAndWave.start,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isDancingToggled.current) {
        randomDance.current = Math.floor(Math.random() * (4 - 1)) + 1
        randomDance.current === 1 && runSequencedAnimation(danceOne)
        randomDance.current === 2 && runSequencedAnimation(danceTwo)
        randomDance.current === 3 && runSequencedAnimation(danceThree)
        randomDance.current === 4 && runSequencedAnimation(danceFour)
        return
      }
      if (isJumpingToggled.current) {
        runSequencedAnimation(jump)
        return
      }
      runSequencedAnimation(danceFour)
    })
  }

  const runSequencedAnimation = (animation) => {
    Animated.sequence([
      Animated.timing(animatedProgress, {
        toValue: animation.start,
        duration: 0,
        delay: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedProgress, {
        toValue: animation.end,
        duration: animation.duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      isJumpingToggled.current = false
      isDancingToggled.current = false
      runLookingAnimation()
    })
  }
  return (
    <Container style={style}>
      {displayedText !== null && !disable && alertTextVisible && (
        <FloatingQuestion
          containerStyle={{
            position: 'absolute',
            left: 75,
            top: Platform.OS === 'ios' ? -110 : -80,
            width: '85%',
          }}
        >
          <TextWithoutTranslation>{displayedText}</TextWithoutTranslation>
        </FloatingQuestion>
      )}
      <TouchableOpacity
        disabled={disable}
        style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}
        activeOpacity={1}
        accessibilityLabel={displayedText}
        onPress={() => {
          isJumpingToggled.current = true
          setAnimatedHearts(animatedHearts + 1)
        }}
      >
        {/* TODO_ALEX */}
        {/* @ts-ignore */}
        {!stationary && selectedAvatar !== 'oky' && (
          <LottieView
            resizeMode="contain"
            style={{
              width: Platform.OS === 'ios' ? 120 : 125,
              bottom: Platform.OS === 'ios' ? 31 : 45,
              ...avatarStyle,
            }}
            source={assets.lottie.avatars[selectedAvatar]}
            progress={animatedProgress}
          />
        )}
        {/* TODO_ALEX */}
        {/* @ts-ignore */}
        {(stationary || selectedAvatar === 'oky') && (
          <Image source={assets.avatars[selectedAvatar].stationary_colour} />
        )}
      </TouchableOpacity>
      {isProgressVisible && (
        <OverallProgressContainer
          style={{
            position: 'absolute',
            // TODO_ALEX
            // @ts-ignore
            bottom: selectedAvatar === 'oky' ? 10 : 115,
          }}
        >
          <ProgressBarContainer>
            <Icon
              source={heartImageFill(animatedHearts * 5)}
              style={{ height: 12, width: 20, marginRight: 5 }}
            />
            <ProgressBar
              color="#e3629b"
              value={animatedHearts * 5 >= 100 ? 100 : animatedHearts * 5}
            />
          </ProgressBarContainer>
          {onPeriod && (
            <ProgressBarContainer>
              <Icon
                source={starImageFill(Object.keys(cardAnswersToday).length)}
                style={{ height: 12, width: 20, marginRight: 5 }}
              />
              <ProgressBar
                value={
                  Object.keys(cardAnswersToday).length * 25 >= 100
                    ? 100
                    : Object.keys(cardAnswersToday).length * 25
                }
              />
            </ProgressBarContainer>
          )}
        </OverallProgressContainer>
      )}
      {textShown !== '' && !isProgressVisible && (
        <InfoText style={{ bottom: 30 }}>{textShown}</InfoText>
      )}
      <HeartAnimation count={animatedHearts} />
    </Container>
  )
}

const heartImageFill = (fill) => {
  if (fill < 50) return assets.static.icons.heart.empty
  if (fill >= 50 && fill < 100) return assets.static.icons.heart.half
  if (fill >= 100) return assets.static.icons.heart.full
}

const starImageFill = (numberOfElements) => {
  if (numberOfElements === null) return assets.static.icons.starOrange.empty
  if (numberOfElements < 2) return assets.static.icons.starOrange.empty
  if (numberOfElements >= 2 && numberOfElements < 4) return assets.static.icons.starOrange.half
  if (numberOfElements >= 4) return assets.static.icons.starOrange.full
}

const Container = styled.View`
  justify-content: center;
  align-items: center;
`

const ProgressBarContainer = styled.View`
  padding-horizontal: 13px;
  padding-left: 10px;
  flex-direction: row;
  align-items: flex-end;
`

const OverallProgressContainer = styled.View`
  justify-content: space-around;
  height: 27px;
  align-items: flex-start;
`

const InfoText = styled(Text)`
  font-size: 13;
  font-family: Roboto-Black;
  color: #ff9e00;
`
