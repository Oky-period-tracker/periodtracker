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
import { Animated, Image, Platform } from 'react-native'
import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'
import { Text } from '../components/common/Text'
import { Icon } from '../components/common/Icon'
import { assets } from '../assets'
import { DayAssetDemo } from './tutorial/DayAssetDemo'
import { CalendarAssetDemo } from './tutorial/CalendarAssetDemo'
import { SpinLoader } from '../components/common/SpinLoader'
import { NoteAssetDemo } from './tutorial/NoteAssetDemo'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import moment from 'moment'
import Tts from 'react-native-tts'
import { translate } from '../i18n'
import { FlowerAssetDemo, flowerAssets } from '../optional/Flower'
import { PrimaryButton } from '../components/common/buttons/PrimaryButton'
import { useScreenDimensions } from '../hooks/useScreenDimensions'
import { useOrientation } from '../hooks/useOrientation'

const arrowSize = 55

// I apologize to anyone who gets to this level of error checking on the sequencing of this component.
// Deadline pressure had mounted beyond compare and it was working stably, It definitely can be simplified and made more declarative
export function TutorialSecondScreen({ navigation }) {
  const { screenWidth, screenHeight } = useScreenDimensions()
  const orientation = useOrientation()
  const { data, isActive, index, currentIndex, absoluteIndex } = useInfiniteScroll()
  const [step, setStep] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [showDayAsset, setShowDayAsset] = React.useState(true)
  const [showNoteAsset, setShowNoteAsset] = React.useState(false)
  const [showCalendarAsset, setShowCalendarAsset] = React.useState(false)
  const [showFlowerAsset, setShowFlowerAsset] = React.useState(false)
  const [positionX] = React.useState(new Animated.Value(-screenWidth))
  const [positionY] = React.useState(new Animated.Value(screenHeight / 2 - arrowSize / 2))
  const [positionZ] = React.useState(new Animated.Value(0))
  const [positionDemoX] = React.useState(new Animated.Value(-screenWidth))
  const [positionDemoY] = React.useState(new Animated.Value(0.15 * screenHeight))
  const [completedStep, setCompletedStep] = React.useState(0)
  const flag = React.useRef(false)
  const dispatch = useDispatch()
  // TODO_ALEX: DO NOT USE HOOKS LIKE THIS
  const renamedUseSelector = useSelector
  const hasTtsActive = useSelector(selectors.isTtsActiveSelector)

  const normalizePosition = (percentage, dimension) => {
    return percentage * dimension - arrowSize / 2
  }

  const stepInfo = {
    '0': {
      text: `tutorial_9`,
      heading: `tutorial_9_content`,
      animationPositionEnd: {
        x: normalizePosition(0.5, screenWidth),
        y: normalizePosition(0.5, screenHeight),
        z: 270,
      },
      demonstrationComponent: { isAvailable: false },
    },
    '1': {
      text: `tutorial_10`,
      heading: `tutorial_10_content`,
      animationPositionEnd: {
        x: normalizePosition(orientation === 'landscape' ? 0.3 : 0.1, screenWidth),
        y: normalizePosition(0.5, screenHeight),
        z: 270,
      },
      demonstrationComponent: { isAvailable: false },
    },
    '2': {
      text: `tutorial_11`,
      heading: `tutorial_11_content`,
      animationPositionEnd: {
        x: normalizePosition(0.6, screenWidth),
        y: normalizePosition(0.5, screenHeight),
        z: 270,
      },
      demonstrationComponent: { isAvailable: false },
    },
    '3': {
      text: `tutorial_12`,
      heading: `tutorial_12_content`,
      animationPositionEnd: {
        x: normalizePosition(0.82, screenWidth),
        y: normalizePosition(0.4, screenHeight),
        z: 180,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(0.15, screenHeight) },
      },
    },
    '4': {
      text: `tutorial_13`,
      heading: `tutorial_13_content`,
      animationPositionEnd: {
        x: normalizePosition(0.82, screenWidth),
        y: normalizePosition(0.3, screenHeight),
        z: 180,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(0.15, screenHeight) },
      },
    },
    '5': {
      text: `tutorial_14`,
      heading: `tutorial_14_content`,
      animationPositionEnd: {
        x: normalizePosition(0.3, screenWidth),
        y: normalizePosition(0.12, screenHeight),
        z: 180,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(0.12, screenHeight) },
      },
    },
    '6': {
      text: `dummy`,
      heading: `dummy`,
      animationPositionEnd: { x: -screenWidth, y: normalizePosition(0.12, screenHeight), z: 180 },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: -500, y: normalizePosition(0.15, screenHeight) },
      },
    },
    '7': {
      text: `dummy`,
      heading: `dummy`,
      animationPositionEnd: { x: -screenWidth, y: normalizePosition(0.1, screenHeight), z: 180 },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: -500, y: normalizePosition(0.15, screenHeight) },
      },
    },
  }

  // TODO: Flower submodule changes:
  /* 
   '6': {
      text: `tutorial_15`,
      heading: `tutorial_15_content`,
      animationPositionEnd: {
        x: normalizePosition(0.45, screenWidth),
        y: normalizePosition(0.12, screenHeight),
        z: 180,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(0.2, screenHeight) },
      },
    },
    '7': {
      text: `tutorial_16`,
      heading: `tutorial_16_content`,
      animationPositionEnd: {
        x: normalizePosition(0.7, screenWidth),
        y: normalizePosition(0.8, screenHeight),
        z: 270,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: -screenWidth, y: normalizePosition(0.2, screenHeight) },
      },
    },
    '8': {
      text: `dummy`,
      heading: `dummy`,
      animationPositionEnd: {
        x: normalizePosition(0.7, screenWidth),
        y: screenHeight + 100,
        z: 270,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(1, screenHeight + 100) },
      },
    },
  }
  
  const lastTutorialStep = _.size(stepInfo) - 1

  */

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
    if (step === 6) {
      flag.current = true
    }
    if (flag.current) {
      dispatch(actions.setTutorialTwoActive(true))
      setLoading(true)
      requestAnimationFrame(() => {
        setTimeout(() => {
          navigateAndReset('MainStack', null)
        }, 1000)
      })
    }
    if (step === 7) return
    animateArrowPosition()
    if (stepInfo[step].demonstrationComponent.isAvailable) {
      // if ([2, 4, 5, 6, 7].includes(step)) { TODO: Flower submodule changes
      if (step === 4 || step === 5) {
        toggleDemonstrationPosition()
        return
      }
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

  const toggleDemonstrationPosition = () => {
    Animated.parallel([
      Animated.timing(positionDemoX, {
        toValue: -500,
        duration: Platform.OS === 'ios' ? 200 : 400,
        useNativeDriver: true,
      }),
      Animated.timing(positionDemoY, {
        toValue: stepInfo[step].demonstrationComponent.position.y,
        duration: Platform.OS === 'ios' ? 200 : 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDayAsset(false)
      setShowNoteAsset(true)
      if (step === 5) {
        setShowNoteAsset(false)
        setShowCalendarAsset(true)
      }
      secondHalf()

      // TODO: Flower module
      /* 
            setShowNoteAsset(false)
      setShowDayAsset(false)
      setShowCalendarAsset(false)
      setShowFlowerAsset(false)
      if (step === 2) {
        setShowDayAsset(true)
      }
      if (step === 4) {
        setShowNoteAsset(true)
      }
      if (step === 5) {
        setShowCalendarAsset(true)
      }
      if (step === 6) {
        setShowFlowerAsset(true)
      }
      secondHalf()
       */
    })
  }

  const secondHalf = () => {
    Animated.parallel([
      Animated.timing(positionDemoX, {
        toValue: stepInfo[step].demonstrationComponent.position.x,
        duration: Platform.OS === 'ios' ? 200 : 400,
        useNativeDriver: true,
      }),
      Animated.timing(positionDemoY, {
        toValue: stepInfo[step].demonstrationComponent.position.y,
        duration: Platform.OS === 'ios' ? 200 : 400,
        useNativeDriver: true,
      }),
    ]).start()
  }

  // TODO: Flower submodule changes:
  /* 
   '6': {
      text: `tutorial_15`,
      heading: `tutorial_15_content`,
      animationPositionEnd: {
        x: normalizePosition(0.45, screenWidth),
        y: normalizePosition(0.12, screenHeight),
        z: 180,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(0.2, screenHeight) },
      },
    },
    '7': {
      text: `tutorial_16`,
      heading: `tutorial_16_content`,
      animationPositionEnd: {
        x: normalizePosition(0.7, screenWidth),
        y: normalizePosition(0.8, screenHeight),
        z: 270,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: -screenWidth, y: normalizePosition(0.2, screenHeight) },
      },
    },
    '8': {
      text: `dummy`,
      heading: `dummy`,
      animationPositionEnd: {
        x: normalizePosition(0.7, screenWidth),
        y: screenHeight + 100,
        z: 270,
      },
      demonstrationComponent: {
        isAvailable: true,
        position: { x: 0, y: normalizePosition(1, screenHeight + 100) },
      },
    },
  }
  */

  // const lastTutorialStep = _.size(stepInfo) - 1 // TODO:

  const getCardAnswersValues = (inputDay) => {
    const cardData = renamedUseSelector((state) =>
      selectors.verifyPeriodDaySelectorWithDate(state, moment(inputDay.date)),
    )
    return cardData
  }

  const skip = () => {
    dispatch(actions.setTutorialTwoActive(true))
    setLoading(true)
    requestAnimationFrame(() => {
      setTimeout(() => {
        navigateAndReset('MainStack', null)
      }, 1000)
    })
  }

  return (
    <BackgroundTheme>
      <Container>
        <TopSeparator />
        <MiddleSection>
          <AvatarSection {...{ step }}>
            {step !== 6 ? (
              <CircleProgress
                onPress={() => null}
                fillColor="#FFC900"
                emptyFill="#F49200"
                style={{
                  alignSelf: 'flex-start',
                  marginLeft: 15,
                  position: 'relative',
                  zIndex: step === 5 ? 999 : 0,
                  elevation: step === 5 ? 10 : 0,
                }}
              />
            ) : flowerAssets && flowerAssets?.flower?.btn ? (
              <Image
                source={flowerAssets.flower.btn}
                style={{
                  width: 50,
                  height: 50,
                  alignSelf: 'flex-start',
                  marginLeft: 82,
                  position: 'relative',
                  zIndex: 999,
                }}
                resizeMethod={'resize'}
              />
            ) : null}

            <Avatar style={{ position: 'absolute', top: 90, zIndex: 0, elevation: 0 }} />
            <Overlay />
          </AvatarSection>
          <WheelSection {...{ step }} style={{ width: Platform.OS === 'ios' ? '70%' : '65%' }}>
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
            <CenterCard style={{ elevation: 0 }} />
            <Overlay />
          </WheelSection>
        </MiddleSection>
        <CarouselSection {...{ step }}>
          <Carousel
            {...{
              index,
              data,
              isActive,
              currentIndex,
              absoluteIndex,
              disableInteraction: true,
              showOverlay: step !== 0 && step !== 1 && step !== 2,
            }}
          />
        </CarouselSection>
      </Container>
      <Empty />

      <Animated.View
        style={{
          width: 60,
          height: 60,
          zIndex: 200,
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
          transform: [{ translateX: positionDemoX }, { translateY: positionDemoY }],
        }}
      >
        <DemonstratedComponent>
          {showDayAsset && <DayAssetDemo step={step} />}
          {showNoteAsset && <NoteAssetDemo step={step} />}
          {showCalendarAsset && <CalendarAssetDemo />}
          {showFlowerAsset && <FlowerAssetDemo />}
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
        {/* TODO: use lastTutorialStep */}
        {step <= 5 && (
          <TutorialInformation {...{ step }}>
            <Heading>{step <= 5 ? stepInfo[step].heading : null}</Heading>
            <TutorialText>{step <= 5 ? stepInfo[step].text : null}</TutorialText>
          </TutorialInformation>
        )}
      </TouchableContinueOverlay>
      <SkipContainer>
        <PrimaryButton
          onPress={skip}
          style={{
            paddingHorizontal: 12,
          }}
        >
          skip
        </PrimaryButton>
      </SkipContainer>
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
  bottom: 56px;
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
  z-index: 9;
`
const AvatarSection = styled.View<{ step: number }>`
  height: 100%;
  width: 35%;
  justify-content: flex-start;
`
const WheelSection = styled.View`
  height: 100%;
  width: 65%;
  align-items: center;
  elevation: 0;
  z-index: -1
  justify-content: center;
  background-color: transparent;
  flex-direction: row;
`
const CarouselSection = styled.View<{ step: number }>`
  z-index: 11;
  height: 30%;
  width: 100%;
  flex-direction: row;
  elevation: 0;
  background-color: ${(props) =>
    props.step === 0 || props.step === 1 || props.step === 2
      ? 'rgba(0, 0, 0, 0.8)'
      : 'transparent'};
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

const TutorialInformation = styled.View<{ step: number }>`
  min-height: 150;
  width: 85%;
  position: absolute;

  ${(props) =>
    props.step !== 3 && props.step !== 4 && props.step !== 5 ? 'top: 25;' : 'bottom: 25;'}
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15;
  padding-horizontal: 15;
  z-index: 999;
`

const DemonstratedComponent = styled.View`
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
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

const SkipContainer = styled.View<{ step: number }>`
  width: 85%;
  position: absolute;
  bottom: 10;
  align-items: flex-end;
  justify-content: flex-end;
  align-self: center;
  z-index: 9999;
`
