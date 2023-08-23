import React from 'react'
import _ from 'lodash'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { CircleProgress } from './mainScreen/CircleProgress'
import styled from 'styled-components/native'
import { CircularSelection } from './mainScreen/wheelCarousel/CircularSelection'
import { Carousel } from './mainScreen/wheelCarousel/Carousel'
import { CenterCard } from './mainScreen/CenterCard'
import { Avatar } from '../components/common/Avatar/Avatar'
import { useInfiniteScroll } from './mainScreen/wheelCarousel/useInfiniteScroll'
import { navigateAndReset } from '../services/navigationService'
import { Animated, Dimensions, Platform } from 'react-native'
import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'
import { Text } from '../components/common/Text'
import { Icon } from '../components/common/Icon'
import { assets } from '../assets'
import { ColourButtonsDemo } from './tutorial/ColourButtonsDemo'
import { SpinLoader } from '../components/common/SpinLoader'
import DeviceInfo from 'react-native-device-info'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import moment from 'moment'
import Tts from 'react-native-tts'
import { translate } from '../i18n'

const screenHeight = Dimensions.get('screen').height
const screenWidth = Dimensions.get('screen').width
const arrowSize = 55
// I apologize to anyone who gets to this level of error checking on the sequencing of this component.
// Deadline pressure had mounted beyond compare and it was working stably, It definitely can be simplified and made more declarative
export function TutorialFirstScreen() {
  const { data, isActive, index, currentIndex, absoluteIndex } = useInfiniteScroll()
  const [step, setStep] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [positionX] = React.useState(new Animated.Value(-screenWidth))
  const [positionY] = React.useState(new Animated.Value(screenHeight / 2 - arrowSize / 2))
  const [positionZ] = React.useState(new Animated.Value(0))
  const [positionDemoX] = React.useState(new Animated.Value(-screenWidth))
  const [positionDemoY] = React.useState(new Animated.Value(0.2 * screenHeight))
  const flag = React.useRef(false)
  const dispatch = useDispatch()
  const [completedStep, setCompletedStep] = React.useState(0)

  const hasTtsActive = useSelector(selectors.isTtsActiveSelector)

  const normalizePosition = (percentage, dimension) => {
    return percentage * dimension - arrowSize / 2
  }
  const renamedUseSelector = useSelector

  const getCardAnswersValues = (inputDay) => {
    const cardData = renamedUseSelector((state) =>
      selectors.verifyPeriodDaySelectorWithDate(state, moment(inputDay.date)),
    )
    return cardData
  }
  const stepInfo = {
    '0': {
      text: `tutorial_0`,
      heading: `tutorial_0_content`,
      animationPositionEnd: {
        x: normalizePosition(0.42, screenWidth),
        y: normalizePosition(0.33, screenHeight),
        z: 180,
      },
      demonstrationComponent: { isAvailable: false },
    },
    '1': {
      text: `tutorial_1`,
      heading: `tutorial_1_content`,
      animationPositionEnd: {
        x: normalizePosition(0.15, screenWidth),
        y: normalizePosition(
          Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 0.4 : 0.35) : 0.33,
          screenHeight,
        ),
        z: 0,
      },
      demonstrationComponent: { isAvailable: false },
    },
    '2': {
      text: `tutorial_3`,
      heading: `tutorial_3_content`,
      animationPositionEnd: {
        x: normalizePosition(0.4, screenWidth),
        y: normalizePosition(
          Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 0.4 : 0.37) : 0.33,
          screenHeight,
        ),
        z: 0,
      },
      demonstrationComponent: { isAvailable: false },
    },
    '3': {
      text: `tutorial_2`,
      heading: `tutorial_2_content`,
      animationPositionEnd: {
        x: normalizePosition(0.4, screenWidth),
        y: normalizePosition(0.52, screenHeight),
        z: 90,
      },
      demonstrationComponent: { isAvailable: false },
    },
    '4': {
      text: `tutorial_4`,
      heading: `tutorial_4_content`,
      animationPositionEnd: {
        x: normalizePosition(0.5, screenWidth),
        y: normalizePosition(0.52, screenHeight),
        z: 90,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(0.2, screenHeight) },
      },
    },
    '5': {
      text: `tutorial_5`,
      heading: `tutorial_5_content`,
      animationPositionEnd: {
        x: normalizePosition(0.5, screenWidth),
        y: normalizePosition(0.52, screenHeight),
        z: 90,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(0.2, screenHeight) },
      },
    },
    '6': {
      text: `tutorial_6`,
      heading: `tutorial_6_content`,
      animationPositionEnd: {
        x: normalizePosition(0.25, screenWidth),
        y: normalizePosition(0.5, screenHeight),
        z: 90,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(0.2, screenHeight) },
      },
    },
    '7': {
      text: `tutorial_7`,
      heading: `tutorial_7_content`,
      animationPositionEnd: {
        x: normalizePosition(0.5, screenWidth),
        y: normalizePosition(0.5, screenHeight),
        z: 90,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(0.2, screenHeight) },
      },
    },
    '8': {
      text: `tutorial_8`,
      heading: `tutorial_8_content`,
      animationPositionEnd: {
        x: normalizePosition(0.75, screenWidth),
        y: normalizePosition(0.5, screenHeight),
        z: 90,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(0.2, screenHeight) },
      },
    },
    '9': {
      text: `closeOut`,
      heading: `closeOut`,
      animationPositionEnd: { x: -100, y: normalizePosition(0.5, screenHeight), z: 0 },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: -screenWidth, y: normalizePosition(0.2, screenHeight) },
      },
    },
    '10': {
      text: `dummy`,
      heading: `dummy`,
      animationPositionEnd: { x: -100, y: normalizePosition(0.5, screenHeight), z: 0 },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: -screenWidth, y: normalizePosition(0.2, screenHeight) },
      },
    },
  }

  React.useEffect(() => {
    if (hasTtsActive) {
      if (completedStep === step) {
        setCompletedStep(step + 1)
        Tts.speak(translate(stepInfo[step].heading))
        Tts.speak(translate(stepInfo[step].text))
      }
    }
  }, [completedStep, stepInfo, step, hasTtsActive])

  React.useEffect(() => {
    if (step === 9) {
      flag.current = true
    }
    if (flag.current) {
      dispatch(actions.setTutorialOneActive(false))
      setLoading(true)
      requestAnimationFrame(() => {
        setTimeout(() => {
          navigateAndReset('MainStack', null)
        }, 2000)
      })
    }
    if (step === 10) return
    animateArrowPosition()
    if (stepInfo[step].demonstrationComponent.isAvailable) {
      animateDemonstrationPosition()
    }
  }, [step])

  const animateArrowPosition = () => {
    Animated.parallel([
      Animated.timing(positionX, {
        toValue: stepInfo[step].animationPositionEnd.x,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(positionY, {
        toValue: stepInfo[step].animationPositionEnd.y,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(positionZ, {
        toValue: stepInfo[step].animationPositionEnd.z,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const animateDemonstrationPosition = () => {
    Animated.parallel([
      Animated.timing(positionDemoX, {
        toValue: stepInfo[step].demonstrationComponent.position.x,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(positionDemoY, {
        toValue: stepInfo[step].demonstrationComponent.position.y,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }
  const rotation = positionZ.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '-360deg'],
  })

  return (
    <BackgroundTheme>
      <Container>
        <TopSeparator style={{ height: DeviceInfo.hasNotch() ? screenHeight * 0.13 : '10%' }} />
        <MiddleSection>
          <AvatarSection {...{ step }}>
            <CircleProgress
              onPress={() => null}
              fillColor="#FFC900"
              emptyFill="#F49200"
              style={{
                alignSelf: 'flex-start',
                marginLeft: 15,
                position: 'relative',
                zIndex: step === 0 ? 999 : 0,
              }}
            />
            <Avatar
              style={{
                position: 'absolute',
                top: 90,
                elevation: step === 0 ? 20 : 0,
                zIndex: step === 0 ? 999 : 0,
              }}
            />
            <Overlay />
          </AvatarSection>
          <WheelSection {...{ step }} style={{ width: Platform.OS === 'ios' ? '68%' : '65%' }}>
            <CircularSelection
              {...{
                data,
                index,
                isActive,
                currentIndex,
                absoluteIndex,
                disableInteraction: true,
              }}
              fetchCardValues={getCardAnswersValues}
            />
            <CenterCard
              style={step === 2 ? { elevation: 20, zIndex: 999 } : { elevation: -20, zIndex: 0 }}
            />
            {step !== 1 && step !== 3 && <Overlay />}
          </WheelSection>
        </MiddleSection>
        <CarouselSection {...{ step }}>
          <Carousel {...{ index, data, isActive, currentIndex, absoluteIndex }} />
          <Overlay style={{ height: '100%' }} />
        </CarouselSection>
      </Container>
      <Empty />
      <Animated.View
        style={{
          width: 60,
          height: 60,
          zIndex: 200,
          elevation: 200,
          transform: [{ translateX: positionX }, { translateY: positionY }],
        }}
      >
        <Animated.View
          style={{
            transform: [{ rotate: rotation }],
          }}
        >
          <Icon
            style={{
              zIndex: 200,
              height: arrowSize,
              width: arrowSize,
              transform: [{ rotateY: '180deg' }],
            }}
            source={assets.static.icons.arrow}
          />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={{
          zIndex: 200,
          elevation: 200,
          transform: [{ translateX: positionDemoX }, { translateY: positionDemoY }],
        }}
      >
        <DemonstratedComponent>
          <ColourButtonsDemo showBlue={step === 4} />
        </DemonstratedComponent>
      </Animated.View>
      <TouchableContinueOverlay
        activeOpacity={1}
        onPress={() => {
          if (!flag.current) {
            setStep((val) => val + 1)
          }
        }}
      >
        {step <= 8 && (
          <TutorialInformation>
            <Heading>{step <= 9 ? stepInfo[step].heading : null}</Heading>
            <TutorialText>{step <= 9 ? stepInfo[step].text : null}</TutorialText>
          </TutorialInformation>
        )}
      </TouchableContinueOverlay>
      <SpinLoader
        backdropOpacity={0}
        isVisible={loading}
        setIsVisible={setLoading}
        text="please_wait_back"
      />
    </BackgroundTheme>
  )
}

const Container = styled.View`
  top: 0;
  bottom: 56;
  right: 0;
  left: 0;
  position: absolute;
`
const Empty = styled.View`
  height: 56px;
  bottom: 0;
  right: 0;
  left: 0;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
`

const TopSeparator = styled.View`
  height: 10%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10;
`
const MiddleSection = styled.View`
  height: 60%;
  width: 100%;
  flex-direction: row;
`
const AvatarSection = styled.View<{ step: number }>`
  height: 100%;
  width: 35%;
  justify-content: flex-start;
  z-index: 999;
`
const WheelSection = styled.View<{ step: number }>`
  height: 100%;
  width: 65%;
  align-items: center;
  elevation: 0;
  z-index: ${(props) => (props.step === 1 || props.step === 3 ? 15 : 0)}
  justify-content: center;
  background-color: ${(props) =>
    props.step === 1 || props.step === 3 ? 'rgba(0, 0, 0, 0.8) ' : 'transparent'};
  flex-direction: row;
`
const CarouselSection = styled.View<{ step: number }>`
  height: 30%;
  width: 100%;
  flex-direction: row;
  elevation: 0;
`

const Overlay = styled.View`
  height: 100%;
  width: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
`

const TouchableContinueOverlay = styled.TouchableOpacity`
  height: 100%;
  width: 100%;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
`

const TutorialInformation = styled.View`
  min-height: 150;
  width: 85%;
  position: absolute;
  bottom: 25;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15;
  padding-horizontal: 15;
`

const DemonstratedComponent = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  position: absolute;
`

const Heading = styled(Text)`
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10;
  color: #a2c72d;
`

const TutorialText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10;
`

const TutorialLeavingText = styled(Text)`
  width: 70%;
  color: #f49200;
  align-self: center;
  font-size: 20;
  font-family: Roboto-Black;
  top: -30%;
  text-align: center;
`
