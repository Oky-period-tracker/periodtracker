// app/src/hooks/useCalendarMarks.ts
import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import {
  allCardAnswersSelector,
  currentLocaleSelector,
  isFuturePredictionActiveSelector,
} from '../redux/selectors'
import { usePredictionEngineState } from '../contexts/PredictionProvider'
import { buildCalendarMarks, DayKind } from '../prediction/calendarMarks'
import { getCalendarInputs, toCalendarDays } from '../prediction/calendarPrediction'
import { CalendarDayMarking } from '../components/CalendarDay'
import { useTranslate } from './useTranslate'
import { useFormatDate } from './useFormatDate'

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
  const predictionsEnabled = !!useSelector(isFuturePredictionActiveSelector)
  const locale = useSelector(currentLocaleSelector)
  const t = useTranslate()
  const { formatDayFullMonth } = useFormatDate()
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
    for (const iso of new Set([...Object.keys(marks.days), today])) {
      const kinds = marks.days[iso]
      const isToday = iso === today
      const label = [
        formatDayFullMonth(iso),
        ...(kinds ?? []).map((k) => t(LABEL_KEY[k])),
        ...(isToday ? [t('calendar_legend_today')] : []),
      ].join(', ')
      result[iso] = { ...(kinds && { kinds }), ...(isToday && { isToday }), label }
    }
    return result
    // t and formatDayFullMonth are new functions on every render but only change with the locale
  }, [marks, today, locale])

  return { markedDates, marks, predictionsEnabled }
}
