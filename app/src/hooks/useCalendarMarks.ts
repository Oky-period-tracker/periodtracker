// app/src/hooks/useCalendarMarks.ts
import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { allCardAnswersSelector, isFuturePredictionSelector } from '../redux/selectors'
import { usePredictionEngineState } from '../contexts/PredictionProvider'
import { buildCalendarMarks, DayKind } from '../prediction/calendarMarks'
import { getCalendarInputs, toCalendarDays } from '../prediction/calendarPrediction'
import { CalendarDayMarking } from '../components/CalendarDay'
import { useTranslate } from './useTranslate'

const LABEL_KEY: Record<DayKind, string> = {
  confirmed: 'calendar_legend_confirmed',
  likelyStart: 'calendar_legend_likely_start',
  possiblePeriod: 'calendar_legend_possible_period',
  ovulation: 'calendar_legend_ovulation',
}

export function useCalendarMarks() {
  // @ts-expect-error allCardAnswersSelector is typed against the old ReduxState shape
  const answers = useSelector((state) => allCardAnswersSelector(state))
  const state = usePredictionEngineState()
  // @ts-expect-error ReduxState typing does not expose prediction here
  const hasSavedPrediction = useSelector((s) => !!s.prediction?.currentCycle)
  const futurePrediction = useSelector(isFuturePredictionSelector)
  const predictionsEnabled = !!futurePrediction?.futurePredictionStatus
  const t = useTranslate()
  const today = moment().format('YYYY-MM-DD')

  const marks = React.useMemo(
    () =>
      buildCalendarMarks({
        ...toCalendarDays(answers),
        ...getCalendarInputs(hasSavedPrediction ? state : null, predictionsEnabled),
        today,
      }),
    [answers, state, hasSavedPrediction, predictionsEnabled, today],
  )

  const markedDates = React.useMemo(() => {
    const result: Record<string, CalendarDayMarking> = {}
    for (const [iso, kinds] of Object.entries(marks.days)) {
      result[iso] = {
        kinds,
        label: [moment(iso).format('D MMMM'), ...kinds.map((k) => t(LABEL_KEY[k]))].join(', '),
      }
    }
    const todayLabel = [moment(today).format('D MMMM'), ...(result[today]?.kinds ?? []).map((k) => t(LABEL_KEY[k])), t('calendar_legend_today')]
    result[today] = { ...result[today], isToday: true, label: todayLabel.join(', ') }
    return result
  }, [marks, today, t])

  return { markedDates, marks, predictionsEnabled }
}
