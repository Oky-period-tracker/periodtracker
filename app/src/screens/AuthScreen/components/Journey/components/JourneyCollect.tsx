import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { JourneyStep, useJourney } from '../JourneyContext'
import { WheelPickerOption } from '../../../../../components/WheelPicker'
import { DateData } from 'react-native-calendars'
import { DatePicker } from '../../../../../components/DatePicker'
import moment from 'moment'
import { WheelPickerModal } from '../../../../../components/WheelPickerModal'
import { asLocal } from '../../../../../services/dateUtils'
import { useColor } from '../../../../../hooks/useColor'

export const JourneyCollect = ({ step }: { step: JourneyStep }) => {
  const { state, dispatch, dayOptions, weekOptions } = useJourney()
  const { palette } = useColor()

  const day = dayOptions.find((item) => item.value === state.periodLength)
  const week = weekOptions.find((item) => item.value === state.cycleLength)

  const setDate = (day: DateData) => {
    const value = asLocal(moment(day.dateString))
    dispatch({ type: 'startDate', value })
  }

  const setPeriodLength = (option: WheelPickerOption | undefined) => {
    const value = option?.value
    dispatch({ type: 'periodLength', value })
  }

  const setCycleLength = (option: WheelPickerOption | undefined) => {
    const value = option?.value
    dispatch({ type: 'cycleLength', value })
  }

  return (
    <>
      {step === 'when_last_period' && (
        <DatePicker selectedDate={state.startDate} onDayPress={setDate} />
      )}
      {step === 'number_days' && (
        <WheelPickerModal
          initialOption={day}
          options={dayOptions}
          onSelect={setPeriodLength}
          actionRight={<FontAwesome size={12} name={'pencil'} color={palette.basic.dark} />}
        />
      )}
      {step === 'number_weeks_between' && (
        <WheelPickerModal
          initialOption={week}
          options={weekOptions}
          onSelect={setCycleLength}
          actionRight={<FontAwesome size={12} name={'pencil'} color={palette.basic.dark} />}
        />
      )}
    </>
  )
}
