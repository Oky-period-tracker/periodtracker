import React from 'react'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { PageContainer } from '../components/layout/PageContainer'
import styled from 'styled-components/native'
import { SwiperContainer } from '../components/common/SwiperContainer'
import { OnboardingCard } from './onboardingScreen/OnboardingCard'
import { assets } from '../assets/index'
import { PrimaryButton } from '../components/common/buttons/PrimaryButton'
import { navigateAndReset } from '../services/navigationService'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import { PenalCodeCard } from './onboardingScreen/PenalCodeCard'
import * as actions from '../redux/actions'
import { useDispatch } from 'react-redux'
import { Animated } from 'react-native'
import { Text } from '../components/common/Text'

export function OnboardingScreen() {
  const ref = React.useRef()
  const dispatch = useDispatch()
  const [index, setIndex] = React.useState(0)
  const [isButtonVisible, setIsButtonVisible] = React.useState(false)
  // @TODO: LANGUAGES This is commented in case the client wants multiple languages
  // const region = useSelector(selectors.currentChosenRegionSelector)

  React.useEffect(() => {
    if (index === 2) {
      setIsButtonVisible(true)
    }
  }, [index])

  // @TODO: LANGUAGES This is commented in case the client wants multiple languages
  // const onPenalCodeComplete = lang => {
  //   dispatch(actions.setChosenRegion(lang))
  //   dispatch(actions.setLocale(lang))
  // }

  return (
    <BackgroundTheme>
      <PageContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Container>
          <SwiperContainer
            scrollEnabled={true} // @TODO: LANGUAGES This is commented in case the client wants multiple languages scrollEnabled={region !== ''}
            setIndex={setIndex}
            pagingEnabled={true}
            ref={ref}
          >
            {/* // @TODO: LANGUAGES This is commented in case the client wants multiple languages */}
            {/* {region === '' && <PenalCodeCard onConfirm={onPenalCodeComplete} />} */}
            <OnboardingCard
              image={assets.static.icons.calendar}
              heading="calendar"
              content="calendar_onboard"
            />
            <OnboardingCard
              image={assets.static.icons.news}
              heading="the_facts"
              content="the_facts_onboard"
            />
            <OnboardingCard
              image={assets.static.icons.profileL}
              heading="friend"
              content="friends_onboard"
            />
          </SwiperContainer>
        </Container>
        {isButtonVisible && (
          <PrimaryButton
            style={{
              backgroundColor: '#f49200',
              width: 100,
              position: 'absolute',
              bottom: 20,
              right: 15,
            }}
            textStyle={{ color: 'white' }}
            onPress={() => {
              dispatch(actions.setHasOpened(true))
              navigateAndReset('LoginStack', null)
            }}
          >
            continue
          </PrimaryButton>
        )}
      </PageContainer>
      <FadeOverlay />
    </BackgroundTheme>
  )
}

const FadeOverlay = () => {
  const [opacity] = React.useState(new Animated.Value(1))
  const [zIndex, setZIndex] = React.useState(10)

  React.useEffect(() => {
    const intervalID = setTimeout(() => {
      fadeOut()
    }, 3000)
    return () => clearTimeout(intervalID)
  }, [])

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setZIndex(-100)
    })
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex,
        opacity,
      }}
    >
      <BackgroundTheme>
        <WelcomeContainer>
          <WelcomeText>welcome_heading</WelcomeText>
          <LaunchLogo resizeMode="contain" source={assets.static.launch_icon} />
        </WelcomeContainer>
      </BackgroundTheme>
    </Animated.View>
  )
}

const Container = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
`

const WelcomeContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const LaunchLogo = styled.Image`
  height: 100px;
  aspect-ratio: 1;
`
const WelcomeText = styled(Text)`
  font-size: 35;
  text-align: center;
  font-family: Roboto-Black;
  color: #e3629b;
  margin-bottom: 30;
`
