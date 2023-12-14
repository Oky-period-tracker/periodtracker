import React from 'react'
import { Platform } from 'react-native'
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
            iconStyle={{ height: 25, width: 25 }}
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              marginRight: 20,
              alignSelf: 'flex-end',
            }}
          />
        )}
      </TopSeparator>
      <MiddleSection>
        <AvatarSection>
          <Row style={{ zIndex: 999 }}>
            <CircleProgress
              isCalendarTextVisible={true}
              onPress={() => navigate('Calendar', { verifiedPeriodsData: allCardsData })}
              fillColor="#FFC900"
              emptyFill="#F49200"
              style={{ alignSelf: 'flex-start', marginLeft: 15 }}
            />
            <FlowerButton style={{ marginStart: 16 }} onPress={() => setFlowerModalVisible(true)} />
          </Row>
          <Avatar style={{ position: 'absolute', top: Platform.OS === 'ios' ? 120 : 90 }} />
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
  width: 65%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`
const CarouselSection = styled.View`
  height: 30%;
  padding-bottom: 20px;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`
