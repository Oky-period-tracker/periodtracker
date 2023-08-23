import { useDisplayText } from '../components/context/DisplayTextContext'
import { useTodayPrediction } from '../components/context/PredictionProvider'
import moment, { Moment } from 'moment'

export const useCheckDayWarning = () => {
  const { setDisplayTextStatic } = useDisplayText()
  const currentCycleInfo = useTodayPrediction()

  return (inputDay: Moment) => {
    const diffFromStart = inputDay.diff(currentCycleInfo.date, 'days')
    if (moment(inputDay).isAfter(moment())) {
      setDisplayTextStatic('too_far_ahead')
      return true
    }
    if (diffFromStart < -14 && currentCycleInfo.cycleDay !== 0) {
      setDisplayTextStatic('too_far_behind')
      return true
    }
    if (diffFromStart > 14 && currentCycleInfo.cycleDay !== 0) {
      // The 0 check is for the use case when there is no history and you move the period forward by accident and put yourself in a state that the cycle has no current information
      setDisplayTextStatic('too_far_ahead')
      return true
    }
    return false
  }
}
