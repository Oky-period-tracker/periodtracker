import * as React from 'react'

import { EmojiQuestionCard } from './EmojiQuestionCard'
import { QuizCard } from './QuizCard'
import { DidYouKnowCard } from './DidYouKnowCard'
import { NotesCard } from './NotesCard'
import { Swiper } from '../../../../components/Swiper'
import { usePredictDay } from '../../../../contexts/PredictionProvider'
import { ScreenProps } from '../../../../navigation/RootNavigator'
import { DayModal } from '../../../../components/DayModal'
import { useToggle } from '../../../../hooks/useToggle'

export const DayTracker = ({ navigation, route }: ScreenProps<'Day'>) => {
  const dataEntry = usePredictDay(route.params.date)

  const [visible, toggleVisible] = useToggle()

  const [index, setIndex] = React.useState(0)

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const isOnPeriod = dataEntry.onPeriod
  const dateIsEven = route.params.date.day() % 2 === 0
  const ContentCard = dateIsEven ? <QuizCard dataEntry={dataEntry} /> : <DidYouKnowCard />

  const components = [
    <EmojiQuestionCard topic={'mood'} dataEntry={dataEntry} />,
    <EmojiQuestionCard topic={'body'} dataEntry={dataEntry} />,
    <EmojiQuestionCard topic={'activity'} dataEntry={dataEntry} />,
    <EmojiQuestionCard topic={'flow'} dataEntry={dataEntry} />,
    <NotesCard dataEntry={dataEntry} goBack={goBack} />,
  ]

  // Insert Quiz | DidYouKnow at Start or End
  const contentIndex = isOnPeriod ? components.length - 1 : 0
  components.splice(contentIndex, 0, ContentCard)

  // Add key prop
  const pages = components.map((page, i) => React.cloneElement(page, { key: `day-card-${i}` }))

  return (
    <>
      <Swiper index={index} setIndex={setIndex} pages={pages} />
      <DayModal
        data={dataEntry}
        visible={visible}
        toggleVisible={toggleVisible}
        hideLaunchButton={false}
      />
    </>
  )
}
