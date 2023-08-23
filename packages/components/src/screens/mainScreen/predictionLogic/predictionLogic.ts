export function decisionProcessPeriod({
  inputDay,
  selectedDayInfo,
  currentCycleInfo,
  history,
  isActive,
  errorCallBack,
  getPredictedCycles,
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
