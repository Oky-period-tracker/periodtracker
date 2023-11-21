import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { CircleProgress } from './mainScreen/CircleProgress'
import styled from 'styled-components/native'
import { CircularSelection } from './mainScreen/wheelCarousel/CircularSelection'
import { Carousel } from './mainScreen/wheelCarousel/Carousel'
import { CenterCard } from './mainScreen/CenterCard'
import { Avatar } from '../components/common/Avatar/Avatar'
import { useTheme } from '../components/context/ThemeContext'
import { navigate } from '../services/navigationService'
import { useInfiniteScroll } from './mainScreen/wheelCarousel/useInfiniteScroll'
import { useTextToSpeechHook } from '../hooks/useTextToSpeechHook'
import { mainScreenSpeech } from '../config'
import { useTodayPrediction, useHistoryPrediction } from '../components/context/PredictionProvider'
import { useRandomText } from '../hooks/useRandomText'
import { InformationButton } from '../components/common/InformationButton'
import { assets } from '../assets'
import * as actions from '../redux/actions'
import { useDispatch } from 'react-redux'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import moment from 'moment'
import { FlowerButton, FlowerModal } from '../optional/Flower'
import { isTablet } from 'react-native-device-info'

export function MainScreen({ navigation }) {
  const { data } = useInfiniteScroll()
  const todayInfo = useTodayPrediction()
  const currentDate: any = { ...todayInfo.date }
  const lastDate: any = moment(currentDate).add(4, 'days')
  const wheelDaysInfo: any[] = Array(7)
    .fill(1)
    .map((i: number) => lastDate.subtract(i, 'days').format('DD MMMM'))
  useTextToSpeechHook({ navigation, text: mainScreenSpeech({ data, wheelDaysInfo, todayInfo }) })

  return <MainScreenContainer navigation={navigation} />
}
const MainScreenContainer = ({ navigation }) => {
  const { data } = useInfiniteScroll()
  const theme = useTheme()
  const todayInfo = useTodayPrediction()
  const dispatch = useDispatch()
  const userID = useSelector(selectors.currentUserSelector).id
  const history = useHistoryPrediction()
  const currentUser = useSelector(selectors.currentUserSelector)

  // @TODO: careful note here, may be worth the performance increase though May not work with Memo now
  React.useEffect(() => {
    dispatch(actions.fetchSurveyContentRequest(userID))
  }, [])

  useRandomText({ navigation })
  return <MainScreenActual key={theme.id} />
}

const MainScreenActual = React.memo(() => {
  const { data, index, isActive, currentIndex, absoluteIndex } = useInfiniteScroll()

  const allCardsData = useSelector((state) => selectors.allCardAnswersSelector(state))

  const { onFertile, onPeriod } = useTodayPrediction()
  const [isFlowerModalVisible, setFlowerModalVisible] = React.useState(false)

  return (
    <BackgroundTheme>
      <TopSeparator>
        {onFertile && !onPeriod && (
          <InformationButton
            icon={assets.static.icons.infoBlue}
            iconStyle={styles.icon}
            style={styles.info}
          />
        )}
      </TopSeparator>
      <MiddleSection>
        <AvatarSection>
          <Row>
            <CircleProgress
              isCalendarTextVisible={true}
              onPress={() => navigate('Calendar', { verifiedPeriodsData: allCardsData })}
              fillColor="#FFC900"
              emptyFill="#F49200"
              style={styles.circle}
            />
            <FlowerButton style={styles.flowerButton} onPress={() => setFlowerModalVisible(true)} />
          </Row>
          <Avatar style={styles.avatar} />
        </AvatarSection>
        <WheelSection>
          <CircularSelection {...{ data, index, isActive, currentIndex, absoluteIndex }} />
          <CenterCard />
        </WheelSection>
      </MiddleSection>
      <CarouselSection>
        <Carousel {...{ index, data, isActive, currentIndex, absoluteIndex }} />
      </CarouselSection>
      <FlowerModal
        isModalVisible={isFlowerModalVisible}
        onDismiss={() => setFlowerModalVisible(false)}
        isStatic={true}
      />
    </BackgroundTheme>
  )
})

const TopSeparator = styled.View`
  height: 10%;
  width: 100%;
  z-index: 9998;
`
const MiddleSection = styled.View`
  height: 60%;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`
const AvatarSection = styled.View`
  flex-direction: column;
  height: 100%;
  width: 35%;
  justify-content: flex-start;
  z-index: 9999;
`
const Row = styled.View`
  flex-direction: row;
  width: 100%;
  z-index: 9999;
`
const WheelSection = styled.View`
  height: 100%;
  width: ${isTablet() ? 40 : 65}%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

const CarouselSection = styled.View`
  height: 30%;
  padding-bottom: ${isTablet() ? 40 : 20}px;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

const styles = StyleSheet.create({
  icon: {
    height: 25,
    width: 25,
  },
  info: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 20,
    alignSelf: 'flex-end',
  },
  flowerButton: {
    marginStart: 16,
  },
  avatar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 90,
  },
  circle: {
    alignSelf: 'flex-start',
    marginLeft: 15,
    backgroundColor: 'red',
  },
})
