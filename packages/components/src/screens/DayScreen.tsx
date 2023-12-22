import React from 'react'
import styled from 'styled-components/native'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { Header } from '../components/common/Header'
import { DayBadge } from '../components/common/DayBadge'
import { DateBadge } from '../components/common/DateBadge'
import { DayCarousel } from './dayScreen/DayCarousel'
import { BackOneScreen, navigateAndReset } from '../services/navigationService'
import { useKeyboardController } from '../hooks/useKeyboardController'
import { InformationButton } from '../components/common/InformationButton'
import { assets } from '../assets'
import { usePredictDay } from '../components/context/PredictionProvider'
import { ThemedModal } from '../components/common/ThemedModal'
import { ColourButtons } from './mainScreen/ColourButtons'
import { commonSelectors } from '../redux/common/selectors'
import { useSelector } from '../hooks/useSelector'
import moment from 'moment'

export function DayScreen({ navigation }) {
  const temp = navigation.getParam('data')
  const dataEntry = usePredictDay(temp.date)
  const [isVisible, setIsVisible] = React.useState(false)
  const { keyboardIsOpen, dismiss } = useKeyboardController()
  const cardAnswersToday = useSelector((state) =>
    commonSelectors.verifyPeriodDaySelectorWithDate(state, moment(dataEntry.date)),
  )

  const goBack = () => {
    if (keyboardIsOpen) {
      return dismiss()
    }

    return BackOneScreen()
  }

  const navigateToTutorial = () => {
    requestAnimationFrame(() => {
      navigateAndReset('TutorialFirstStack', null)
    })
  }
  return (
    <BackgroundTheme>
      <InfoSection>
        {dataEntry.onFertile && !dataEntry.onPeriod && (
          <InformationButton
            icon={assets.static.icons.infoBlue}
            iconStyle={{ height: 25, width: 25 }}
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              marginRight: 10,
            }}
          />
        )}

        <DateBadge
          style={{ width: 60, height: 60, marginRight: 10 }}
          dataEntry={dataEntry}
          showModal={() => setIsVisible(true)}
          cardValues={cardAnswersToday}
        />
        <DayBadge
          style={{ width: 90, height: 50 }}
          fontSizes={{ small: 16, big: 24 }}
          dataEntry={dataEntry}
          cardValues={cardAnswersToday}
        />
      </InfoSection>
      <Header onPressBackButton={goBack} screenTitle={''} showScreenTitle={false} />
      <DayCarouselSection>
        <DayCarousel navigation={navigation} dataEntry={dataEntry} />
      </DayCarouselSection>
      <ThemedModal {...{ isVisible, setIsVisible }}>
        <ColourButtons
          navigateToTutorial={navigateToTutorial}
          inputDay={dataEntry.date}
          hide={() => setIsVisible(false)}
          onPress={() => setIsVisible(false)}
          selectedDayInfo={dataEntry}
          cardValues={cardAnswersToday}
        />
      </ThemedModal>
    </BackgroundTheme>
  )
}

const DayCarouselSection = styled.View`
  width: 100%;
  flex: 1;
  padding-bottom: 25px;
`

const InfoSection = styled.View`
  flex-direction: row;
  align-items: center;
  position: absolute;
  z-index: 10;
  top: 8px;
  right: 30px;
`
