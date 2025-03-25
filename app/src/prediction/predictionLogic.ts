// TODO:
// eslint-disable-next-line
// @ts-nocheck
export function decisionProcessPeriod({
  inputDay, // moment.Moment
  selectedDayInfo, // PredictionDayInfo
  currentCycleInfo, // PredictionDayInfo
  history, // History
  isActive, // boolean
  // errorCallBack,
  // getPredictedCycles,
}) {
  const diffFromStart = inputDay.diff(currentCycleInfo.cycleStart, 'days')
  if (diffFromStart >= currentCycleInfo.cycleLength) {
    return {
      type: 'adjust-future-mens-end',
      day: inputDay,
    }
  }

  if (!isActive && diffFromStart >= 0) {
    return {
      type: 'adjust-mens-end',
      day: inputDay,
    }
  }

  if (
    (diffFromStart < 0 && selectedDayInfo.cycleDay > selectedDayInfo.cycleLength / 2) ||
    selectedDayInfo.cycleDay === 0
  ) {
    // more than one history behind
    if (history[0] && Math.abs(diffFromStart) > history[0].cycleLength) {
      return { type: 'history-start-adjust', day: inputDay }
    }
    // cant reduce period to less than 14 days into the previous cycle and if current length is more than 10

    return { type: 'current-start-adjust', day: inputDay }
  }
  if (diffFromStart < 0 && selectedDayInfo.cycleDay <= selectedDayInfo.cycleLength / 2) {
    // cant reduce period to less than 14 days into the previous cycle and if current length is more than 10

    return { type: 'adjust-mens-end-history', day: inputDay }
  }

  return { type: 'adjust-mens-end', day: inputDay }
}

export function decisionProcessNonPeriod({
  inputDay,
  selectedDayInfo,
  currentCycleInfo,
  history,
  isActive,
}) {
  const diffFromStart = inputDay.diff(currentCycleInfo.cycleStart, 'days')

  if (!isActive && diffFromStart >= 0) {
    return {
      type: 'adjust-mens-end',
      day: inputDay.clone().subtract(1, 'days'),
    }
  }

  if (diffFromStart >= currentCycleInfo.cycleLength) {
    return {
      type: 'future-start-adjust',
      day: inputDay.clone().add(1, 'days'),
    }
  }

  if (
    (diffFromStart < 0 && selectedDayInfo.cycleDay < selectedDayInfo.periodLength / 2) ||
    (diffFromStart < 0 && selectedDayInfo.cycleDay === 0)
  ) {
    return {
      type: 'history-start-adjust',
      day: inputDay.clone().add(1, 'days'),
    }
  }

  if (diffFromStart < 0 && selectedDayInfo.cycleDay < currentCycleInfo.cycleLength / 2) {
    // cant reduce period to less than 14 days into the previous cycle and if current length is more than 10
    return {
      type: 'adjust-mens-end-history',
      day: inputDay.clone().subtract(1, 'days'),
    }
  }

  if (diffFromStart >= 0 && diffFromStart < selectedDayInfo.periodLength / 2) {
    return {
      type: 'adjust-mens-end',
      day: inputDay.clone().subtract(1, 'days'),
    }
  }
  return {
    type: 'adjust-mens-end',
    day: inputDay.clone().subtract(1, 'days'),
  }
}

import moment from 'moment'
import { PeriodDate } from '../screens/CalendarScreen'
import { PredictionState } from './PredictionState'

export function generatePeriodDates(predictionFullStateInfo: PredictionState) {

  const periodDates: Array<PeriodDate> = []

  // Helper function to generate period days from start date and period length
  function getPeriodDays(
    startDate: Date,
    periodLength: number,
    isMLGenerated: boolean,
    userVerified: null | boolean = null,
  ) {
    const dates = []
    for (let i = 0; i < periodLength; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      dates.push({
        date: date.toLocaleDateString('en-GB'), // Format DD/MM/YYYY
        mlGenerated: isMLGenerated,
        userVerified: userVerified,
      });
    }
    return dates
  }

  // Process history periods
  if (predictionFullStateInfo.history && Array.isArray(predictionFullStateInfo.history)) {
    predictionFullStateInfo.history.forEach((entry) => {
      if (entry.cycleStartDate && entry.periodLength) {
        const startDate = moment(entry.cycleStartDate).toDate() // ✅ FIXED: Convert Moment to Date
        periodDates.push(...getPeriodDays(startDate, entry.periodLength, true, null))
      }
    })
  }

  // Process current cycle period
  if (
    predictionFullStateInfo.currentCycle &&
    predictionFullStateInfo.currentCycle.startDate &&
    predictionFullStateInfo.currentCycle.periodLength
  ) {
    const startDate = moment(predictionFullStateInfo.currentCycle.startDate).toDate() // ✅ FIXED: Convert Moment to Date
    periodDates.push(
      ...getPeriodDays(startDate, predictionFullStateInfo.currentCycle.periodLength, true, null),
    )
  }

  // Generate future period dates for the next 12 months
  if (predictionFullStateInfo.smartPrediction) {
    const { smaCycleLength, smaPeriodLength } = predictionFullStateInfo.smartPrediction
    if (smaCycleLength && smaPeriodLength) {
      let lastCycleStartDate = moment(predictionFullStateInfo.currentCycle.startDate).toDate() // ✅ FIXED

      for (let i = 0; i < 12; i++) {
        const futureStartDate = new Date(lastCycleStartDate) // ✅ FIXED: Create a new Date to avoid mutation
        futureStartDate.setDate(futureStartDate.getDate() + smaCycleLength)
        lastCycleStartDate = new Date(futureStartDate) // Update reference
        periodDates.push(...getPeriodDays(futureStartDate, smaPeriodLength, true, null))
      }
    }
  }

  return periodDates
}
