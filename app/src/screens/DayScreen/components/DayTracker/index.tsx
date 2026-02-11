import * as React from 'react'
import moment from 'moment'

import { EmojiQuestionCard } from './EmojiQuestionCard'
import { QuizCard } from './QuizCard'
import { DidYouKnowCard } from './DidYouKnowCard'
import { NotesCard } from './NotesCard'
import { Swiper } from '../../../../components/Swiper'
import { usePredictDay, usePredictionEngineState } from '../../../../contexts/PredictionProvider'
import { ScreenProps } from '../../../../navigation/RootNavigator'
import { DayModal } from '../../../../components/DayModal'
import { useToggle } from '../../../../hooks/useToggle'
import { useDispatch, useSelector } from 'react-redux'
import { appTokenSelector, currentUserSelector } from '../../../../redux/selectors'
import { editUser } from '../../../../redux/actions'
import { httpClient } from '../../../../services/HttpClient'
import { generatePeriodDates } from '../../../../prediction/predictionLogic'
import { useCycleCalculation } from '../../../../hooks/useCycleCalculation'
import { User } from '../../../../types'

export const DayTracker = ({ navigation, route }: ScreenProps<'Day'>) => {
  const dataEntry = usePredictDay(route.params.date)

  const [visible, toggleVisible] = useToggle()

  const [index, setIndex] = React.useState(0)

  const currentUser = useSelector(currentUserSelector) as User
  const appToken = useSelector(appTokenSelector)
  const reduxDispatch = useDispatch()
  const predictionFullState = usePredictionEngineState()
  const { updateCycleCount } = useCycleCalculation()

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const handleDayModalResponse = async (isPeriodDay: boolean, periodDate: string) => {
    const predictedPeriodDates = generatePeriodDates(predictionFullState)

    let updatedPeriodDates = currentUser.metadata?.periodDates
      ? [...currentUser.metadata.periodDates]
      : []

    const mlDatesToAdd = predictedPeriodDates
      .filter((entry) => !updatedPeriodDates.some((u) => u.date === entry.date))
      .map((entry) => ({
        ...entry,
        mlGenerated: false,
        userVerified: entry.userVerified || false,
      }))
    updatedPeriodDates = [...updatedPeriodDates, ...mlDatesToAdd]

    const isMlPredicted = predictedPeriodDates.some((entry) => entry.date === periodDate)
    const existingDateIndex = updatedPeriodDates.findIndex((entry) => entry.date === periodDate)

    let shouldRecalculateCycles = false

    if (isPeriodDay) {
      if (existingDateIndex !== -1) {
        const existingEntry = updatedPeriodDates[existingDateIndex]
        if (existingEntry.userVerified === true) {
          return
        } else {
          updatedPeriodDates[existingDateIndex] = {
            ...existingEntry,
            userVerified: true,
            mlGenerated: false,
          }
          shouldRecalculateCycles = true
        }
      } else {
        updatedPeriodDates.push({
          date: periodDate,
          mlGenerated: isMlPredicted,
          userVerified: true,
        })
        shouldRecalculateCycles = true
      }
    } else {
      if (existingDateIndex !== -1) {
        const existingEntry = updatedPeriodDates[existingDateIndex]
        if (existingEntry.userVerified === true) {
          updatedPeriodDates.splice(existingDateIndex, 1)
          shouldRecalculateCycles = true
        } else {
          updatedPeriodDates.splice(existingDateIndex, 1)
        }
      } else {
        return
      }
    }

    updatedPeriodDates.sort((a, b) => {
      const dateA = moment(a.date, ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'], true)
      const dateB = moment(b.date, ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'], true)
      return dateA.valueOf() - dateB.valueOf()
    })

    // Update local state first (optimistic) so locks unlock immediately
    reduxDispatch(editUser({
      metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
    }))

    if (shouldRecalculateCycles) {
      await updateCycleCount(updatedPeriodDates)
    }

    // Sync to server in the background (failure won't block local state)
    if (appToken) {
      try {
        await httpClient.updateUserVerifiedDays({
          appToken,
          metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
        })
      } catch (error) {
        console.error('Error syncing period dates to server:', error)
      }
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
        onHandleResponse={handleDayModalResponse}
      />
    </>
  )
}
