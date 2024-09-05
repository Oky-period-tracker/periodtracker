import React from 'react'
import { Swiper } from '../../../../components/Swiper'
import { JourneyProvider, journeySteps, useJourney } from './JourneyContext'
import { JourneyCard } from './components/JourneyCard'
import { JourneyReview } from './components/JourneyReview'
import { FullScreen } from '../../../../components/Screen'

export const Journey = () => {
  return (
    <FullScreen>
      <JourneyProvider>
        <JourneyInner />
      </JourneyProvider>
    </FullScreen>
  )
}

const JourneyInner = () => {
  const { state, dispatch } = useJourney()
  const setIndex = (value: number) => dispatch({ type: 'stepIndex', value })

  const pages = [
    ...journeySteps.map((step) => <JourneyCard key={`journey-${step}`} step={step} />),
    <JourneyReview key={`journey-review`} />,
  ]

  return <Swiper index={state.stepIndex} setIndex={setIndex} pages={pages} />
}
