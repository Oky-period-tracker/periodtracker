import React from 'react'
import { Checkbox } from '../../../../components/Checkbox'
import { useSurvey } from './SurveyContext'

export const SurveyConsent = () => {
  const { state, dispatch } = useSurvey()
  const { agree } = state

  const onYesPress = () => {
    dispatch({ type: 'agree', value: true })
  }

  const onNoPress = () => {
    dispatch({ type: 'agree', value: false })
  }

  return (
    <>
      <Checkbox
        label={'Yes'}
        onPress={onYesPress}
        checked={!!agree}
        checkedStatus={'danger'}
        checkedTextStatus={'danger'}
      />
      <Checkbox
        label={'not_now'}
        onPress={onNoPress}
        checked={agree === false}
        checkedStatus={'danger'}
        checkedTextStatus={'danger'}
      />
    </>
  )
}
