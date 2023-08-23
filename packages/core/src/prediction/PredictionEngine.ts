import _ from 'lodash'
import moment, { Moment } from 'moment'
import { PredictionState } from './PredictionState'

type Subscriber = (state: PredictionState) => void
const maxPeriodLength = 11
const minPeriodLength = 1
const minBufferBetweenCycles = 2

export class PredictionEngine {
  private constructor(private state: PredictionState, private listener: Subscriber = () => null) {
    this._currentDayChecking()
  }

  public static fromState(state: PredictionState) {
    return new PredictionEngine(state)
  }

  // +=+=+=+=+=+=+=+=+=+=+=+=+=+ Main Engine +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
  public predictDay(inputDay: Moment, isVerified: boolean = false, selectedDayInfo: any = {}) {
    let onPeriod = false
    let onFertile = false
    let daysLeftOnPeriod = 0
    let periodLength = this.state.currentCycle.periodLength
    let cycleLength = this.state.currentCycle.cycleLength

    if (!this.state.isActive) {
      // user case where child has not started her period yet
      return {
        onPeriod,
        onFertile,
        date: moment(inputDay).startOf('day'),
        cycleDay: 0,
        daysLeftOnPeriod: 0,
        cycleStart: moment().startOf('day'),
        daysUntilNextPeriod: 0,
        cycleLength: 100,
        periodLength: 0,
        isVerified: true,
      }
    }
    // ------------------------- Basic Calcs --------------------------------
    let cycleStart = this.state.currentCycle.startDate
    const diffDays = inputDay.diff(cycleStart, 'days')
    let cycleDay = diffDays + 1 // because days start from 1 and not 0
    // --------------- Future and History Handling -----------------------------
    if (diffDays >= cycleLength && diffDays > 0) {
      // Future Predictions
      periodLength = this.state.smartPrediction.smaPeriodLength
      const numberOfCyclesAheadOfCurrent = Math.floor(
        (diffDays - cycleLength) / this.state.smartPrediction.smaCycleLength,
      )
      cycleStart = moment(cycleStart)
        .clone()
        .add(
          cycleLength + numberOfCyclesAheadOfCurrent * this.state.smartPrediction.smaCycleLength,
          'days',
        )
      cycleDay =
        diffDays -
        cycleLength -
        numberOfCyclesAheadOfCurrent * this.state.smartPrediction.smaCycleLength +
        1
    }
    if (diffDays < 0) {
      // History Predictions
      const relevantCycleHistoryEntry = this._getClosetCycleHistoryInfo(inputDay).closetCycle
      if (_.isEmpty(relevantCycleHistoryEntry)) {
        const log = {
          onPeriod,
          onFertile,
          date: moment(inputDay).startOf('day'),
          cycleDay: 0,
          daysLeftOnPeriod: 0,
          cycleStart: moment(0),
          daysUntilNextPeriod: 0,
          cycleLength: 100,
          periodLength: 0,
        }

        return {
          onPeriod,
          onFertile,
          date: moment(inputDay).startOf('day'),
          cycleDay: 0,
          daysLeftOnPeriod: 0,
          cycleStart: moment(0),
          daysUntilNextPeriod: 0,
          cycleLength: 100,
          periodLength: 0,
          isVerified,
        }
      }
      cycleStart = relevantCycleHistoryEntry.cycleStartDate
      cycleLength = relevantCycleHistoryEntry.cycleLength
      periodLength = relevantCycleHistoryEntry.periodLength
      const diffFromRelevantStart = inputDay.diff(relevantCycleHistoryEntry.cycleStartDate, 'days')
      cycleDay = diffFromRelevantStart + 1
    }

    // ------------------------- Dependant Constants -------------------------------
    // if we are outside our current cycle we need to calculate the fertile period relative to the smart prediction length not the
    // current cycle length therefore overwrite it for the following calculation
    if (diffDays >= cycleLength && diffDays > 0) {
      cycleLength = this.state.smartPrediction.smaCycleLength
    }
    const midCycle = Math.floor(cycleLength / 2)
    const fertileDayStart = midCycle - Math.floor(this._fertileLength(cycleLength) / 2)
    const fertileDayEnd = midCycle + Math.floor(this._fertileLength(cycleLength) / 2)
    const daysUntilNextPeriod = cycleLength - cycleDay

    // ------------------------- Conditions ------------------------------------------

    // if cycle day is within the period days (ie if the person is on their period)
    if (cycleDay <= periodLength) {
      onPeriod = true // -------->>>>>>>>>>> commented
      daysLeftOnPeriod = periodLength - cycleDay
    }
    if (fertileDayStart <= cycleDay && cycleDay <= fertileDayEnd) {
      onFertile = true
    }

    // --------------------- Return Statement ----------------------------------------
    return {
      onPeriod,
      onFertile,
      date: moment(inputDay).startOf('day'),
      cycleDay,
      daysLeftOnPeriod,
      cycleStart,
      daysUntilNextPeriod,
      cycleLength,
      periodLength,
      isVerified,
    }
  }

  // +=+=+=+=+=+=+=+=+=+ Range Population +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

  public calculateStatusForDateRange(startDate: Moment, endDate: Moment, verifiedPeriodsData: any) {
    const loop = moment(startDate)
    let markedDates = {}
    while (loop <= endDate) {
      const newDate = moment(loop.date(loop.date() + 1)).startOf('day')

      const {
        onPeriod,
        onFertile,
        cycleDay,
        date,
        daysLeftOnPeriod,
        cycleLength,
        // isVerified,
      } = this.predictDay(newDate)

      if (onPeriod || onFertile) {
        const tempArr = Object.keys(verifiedPeriodsData)
        const tempValuesArr = Object.values(verifiedPeriodsData)
        let dateExists = false
        tempArr.forEach((element, index) => {
          if (moment(element).isSame(moment(date).format('YYYY-MM-DD'))) {
            let periodDayValue: any = {}
            periodDayValue = tempValuesArr[index]
            if (Object.keys(periodDayValue).includes('periodDay')) {
              if (periodDayValue?.periodDay) {
                dateExists = true
              }
            }
          }
        })

        // feed back relevant styling information for Calendar shape {'2019-05-12': { styles...}}
        const newEntry = date.format('YYYY-MM-DD')

        let color = '#57BBCA'
        let borderColor = '#e3629b'
        if (onPeriod && dateExists) {
          color = '#e3629b'
          borderColor = '#e3629b'
        } else if (onPeriod && !dateExists) {
          color = 'white'
          borderColor = '#e3629b'
        } else if (onFertile) {
          color = '#3ea4dd'
          borderColor = '#3ea4dd'
        } else {
          color = '#CF386D'
          borderColor = '#E3629B'
        }
        markedDates = {
          ...markedDates,
          [newEntry]: {
            customStyles: {
              container: {
                borderColor,
                borderWidth: 2,
                backgroundColor: color,
                justifyContent: 'center',
                alignItems: 'center',
              },
              text: {
                color: onPeriod ? (dateExists ? 'white' : '#CF386D') : 'white',
                fontWeight: '600',
                fontSize: 14,
              },
              selected: true,
              marked: true,
            },
          },
        }
      } else {
        const newEntry = date.format('YYYY-MM-DD')
        markedDates = {
          ...markedDates,
          [newEntry]: {
            customStyles: {
              container: {
                borderColor: '#91d9e2',
                borderWidth: 2,
                backgroundColor: '#91d9e2',
                justifyContent: 'center',
                alignItems: 'center',
              },
              text: {
                color: 'white',
                fontWeight: '600',
              },
              selected: true,
              marked: true,
            },
          },
        }
      }
    }
    return markedDates
  }
  // +=+=+=+=+=+=+=+=+=+ Range Population Full Info +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=

  public calculateFullInfoForDateRange(startDate: Moment, endDate: Moment) {
    const loop = moment(startDate).startOf('day')
    const dateArray = []
    while (loop <= endDate) {
      const newDate = moment(loop.date(loop.date() + 1)).startOf('day')
      dateArray.push(this.predictDay(newDate))
    }
    return dateArray
  }

  // +=+=+=+=+==+=+=++=+=+=+=+ Get State From Store =+=+=++=+=+=+=+=+=+=+==+=+=+=+=+

  public getPredictorState() {
    // send state from engine to store
    return this.state
  }

  public subscribe(callback: Subscriber) {
    // passes state to callback listen
    this.listener = callback

    // unsubscribe
    return () => {
      this.listener = () => null
    }
  }

  // +=+=+=+=+==+=+=+ User Input Handling +=+=+=+=+=+=+=+=++=+=+=+=+=+=+=+==+=+=+=+=+

  public userInputDispatch({ type, inputDay, errorCallBack = (err: string) => null }) {
    this.state.isActive = true
    switch (type) {
      case 'adjust-mens-end':
        this._adjustMenstruatingHandler(inputDay, errorCallBack)
        break
      case 'start-next-cycle':
        this._startedEarlyHandler(inputDay, errorCallBack)
        break
      case 'current-start-adjust':
        this._adjustCurrentStartDateHandler(inputDay, errorCallBack)
        break
      case 'history-start-adjust':
        this._adjustHistoryStartDateHandler(inputDay, errorCallBack)
        break
      case 'adjust-mens-end-history':
        this._adjustMenstruatingHistoryHandler(inputDay, errorCallBack)
        break
      case 'future-start-adjust':
        this._adjustFutureStartDateHandler(inputDay, errorCallBack)
        break
      case 'adjust-future-mens-end':
        this._adjustFutureMenstruatingHandler(inputDay, errorCallBack)
        break

      default:
        break
    }
    this.listener(this.state)
  }

  // +=+=+=+=+==+=+=+=+= Private Methods +=+=+=+=+=+=+=+=++=+=+=+=+=+=+=+==+=+=+=+=+

  private _fertileLength(cycleLength) {
    return Math.round(cycleLength / 7)
  }

  private _currentDayChecking() {
    const todayDate = moment().startOf('day')
    const diffDays = todayDate.diff(this.state.currentCycle.startDate, 'days')
    // Only executes if the current day is outside the assumed current cycle
    if (!this.state.isActive) {
      this.state.currentCycle.startDate = todayDate
    }
    if (diffDays >= this.state.currentCycle.cycleLength) {
      // Check how far ahead we are of the assumed current cycle in number of cycles
      const daysAheadOfCurrentCycleEnd = diffDays - this.state.currentCycle.cycleLength
      if (daysAheadOfCurrentCycleEnd < this.state.smartPrediction.smaCycleLength) {
        // only if we are one cycle ahead
        const dayToCheck = this.state.currentCycle.startDate
          .clone()
          .add(this.state.currentCycle.cycleLength, 'days')
        const completionDay = this.predictDay(dayToCheck).cycleStart
        this._cycleCompletion(completionDay)
        return
      }
      const numberOfCyclesAheadOfCurrent = Math.ceil(
        daysAheadOfCurrentCycleEnd / this.state.smartPrediction.smaCycleLength,
      )
      const startingPoint = this.state.currentCycle.startDate
      let i = 0
      while (i < numberOfCyclesAheadOfCurrent) {
        // loop through completing all cycles that have been missed and add to history
        const dayToCheck = startingPoint
          .clone()
          .add(
            this.state.currentCycle.cycleLength + i * this.state.smartPrediction.smaCycleLength,
            'days',
          )
        const completionDay = this.predictDay(dayToCheck).cycleStart
        this._cycleCompletion(completionDay)
        i += 1
      }
    }
  }

  private _adjustMenstruatingHandler(inputDay, errorCallBack) {
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')
    if (daysFromStart >= maxPeriodLength) {
      errorCallBack('period_too_long')
      return
    }
    if (
      daysFromStart >= 0 &&
      daysFromStart < maxPeriodLength // cant have 11 days of bleeding
    ) {
      this.state.currentCycle.periodLength =
        inputDay.diff(this.state.currentCycle.startDate, 'days') + 1
    }
  }

  private _startedEarlyHandler(inputDay, errorCallBack) {
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')
    if (daysFromStart > 0 && daysFromStart < this.state.currentCycle.cycleLength) {
      this._cycleCompletion(inputDay)
    }
    if (daysFromStart < 0) {
      this._adjustCurrentStartDateHandler(inputDay, errorCallBack) // in the event the user shifted the current cycle forward
    }
  }

  private _adjustCurrentStartDateHandler(inputDay, errorCallBack) {
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')
    if (this.state.currentCycle.periodLength + Math.abs(daysFromStart) > maxPeriodLength) {
      errorCallBack('period_too_long')
      return
    }
    if (!this.state.history[0]) {
      this.state.currentCycle.startDate = inputDay
      this.state.currentCycle.cycleLength += -daysFromStart
      this.state.currentCycle.periodLength += -daysFromStart
      return
    }
    const daysFromPreviousStart = inputDay.diff(this.state.history[0].cycleStartDate, 'days')
    // ----------- if between current cycle start and last cycle start --------
    if (daysFromStart < 0 && daysFromPreviousStart > 0) {
      const relevantCycleHistoryEntry = this._getClosetCycleHistoryInfo(inputDay)
      // returns early if selected day is within 2 days of the previous period (No back to back periods)
      if (
        daysFromPreviousStart <
        relevantCycleHistoryEntry.closetCycle.periodLength + minBufferBetweenCycles
      ) {
        errorCallBack('too_close')
        return
      }
      const updateHistory = {
        ...relevantCycleHistoryEntry.closetCycle,
        cycleEndDate: inputDay.clone().subtract(1, 'days'),
        cycleLength: inputDay.diff(relevantCycleHistoryEntry.closetCycle.cycleStartDate, 'days'),
      }
      this.state.history[relevantCycleHistoryEntry.closestIndex] = updateHistory
      this.state.currentCycle.startDate = inputDay
      this.state.currentCycle.cycleLength += -daysFromStart
      this.state.currentCycle.periodLength += -daysFromStart
    }
    // --------- if between current cycle start and next cycle start ----------
    else if (daysFromStart > 0 && daysFromStart < this.state.currentCycle.cycleLength) {
      if (this.state.currentCycle.periodLength + -daysFromStart < 1) return
      this.state.currentCycle.startDate = inputDay
      this.state.currentCycle.cycleLength += -daysFromStart
      this.state.currentCycle.periodLength += -daysFromStart
      const updateHistory = {
        ...this.state.history[0],
        cycleEndDate: inputDay.clone().subtract(1, 'days'),
        cycleLength: inputDay.diff(this.state.history[0].cycleStartDate, 'days'),
      }
      this.state.history[0] = updateHistory
    }
    // Check If the current cycle status must change from the above actions
    const todayInfo = this.predictDay(moment().startOf('day'))
    const diffToCurrentStart = todayInfo.cycleStart.diff(this.state.currentCycle.startDate, 'days')
    if (diffToCurrentStart !== 0) {
      // take the history out and set the state to that
      this.state.currentCycle.startDate = this.state.history[0].cycleStartDate
      this.state.currentCycle.cycleLength = this.state.history[0].cycleLength
      this.state.currentCycle.periodLength = this.state.history[0].periodLength
      this.state.history.shift()
    }
  }

  private _adjustFutureStartDateHandler(inputDay, errorCallBack) {
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')

    if (daysFromStart < 50 && daysFromStart > 10) {
      this.state.currentCycle.cycleLength = daysFromStart
    }
  }
  private _adjustFutureMenstruatingHandler(inputDay, errorCallBack) {
    errorCallBack('too_far_ahead')
  }

  private _getClosetCycleHistoryInfo(inputDay) {
    // tracking history must be sorted from most recent to oldest
    let closetCycle: any = {}
    let closestIndex: number = 0
    this.state.history.some((value, index) => {
      const startDateDiff = inputDay.valueOf() - value.cycleStartDate.valueOf()
      if (startDateDiff < 0) {
        return // return early
      }
      closetCycle = value
      closestIndex = index
      return true // return true breaks out of the some loop
    })
    return { closetCycle, closestIndex }
  }

  private _cycleCompletion(completionDate) {
    const adjustedCycleLength = completionDate.diff(this.state.currentCycle.startDate, 'days')
    this.state.history.unshift({
      cycleStartDate: this.state.currentCycle.startDate,
      cycleEndDate: moment(completionDate.clone().subtract(1, 'days')).startOf('day'),
      periodLength: this.state.currentCycle.periodLength,
      cycleLength: adjustedCycleLength,
    })
    this.state.currentCycle.startDate = moment(completionDate.valueOf()).startOf('day')
    this.state.smartPrediction.circularPeriodLength.push(this.state.currentCycle.periodLength)
    this.state.smartPrediction.smaPeriodLength = Math.round(
      arrayAverage(this.state.smartPrediction.circularPeriodLength.toarray()),
    )
    this.state.currentCycle.periodLength = this.state.smartPrediction.smaPeriodLength
    // ignores irregular entries in the smart Prediction
    if (adjustedCycleLength > 15) {
      this.state.smartPrediction.circularCycleLength.push(adjustedCycleLength)
    } else {
      this.state.smartPrediction.circularCycleLength.push(28)
    }
    this.state.smartPrediction.smaCycleLength = Math.round(
      arrayAverage(this.state.smartPrediction.circularCycleLength.toarray()),
    )
    this.state.currentCycle.cycleLength = this.state.smartPrediction.smaCycleLength
  }

  // +=+=+=+=+==+=+=+=+= History Adjust Methods +=+=+=+=+=+=+=+=++=+=+=+=+=+=+=+==+=+=+=+=+

  private _adjustHistoryStartDateHandler(inputDay, errorCallBack) {
    const { closetCycle, closestIndex } = this._getClosetCycleHistoryInfo(inputDay)
    const indexMorePresent = closestIndex - 1
    const indexMorePast = closestIndex + 1
    if (_.isEmpty(closetCycle)) {
      const daysFromStart = inputDay.diff(
        this.state.history[this.state.history.length - 1].cycleStartDate,
        'days',
      )
      const periodLengthToBe =
        this.state.history[this.state.history.length - 1].periodLength + -daysFromStart
      const cycleLengthToBe =
        this.state.history[this.state.history.length - 1].cycleLength + -daysFromStart
      if (periodLengthToBe >= maxPeriodLength) {
        errorCallBack('too_far_behind')
        return
      }
      if (cycleLengthToBe < periodLengthToBe + minBufferBetweenCycles) {
        errorCallBack('too_close')
        return
      }
      this.state.history[this.state.history.length - 1].cycleStartDate = inputDay
      this.state.history[this.state.history.length - 1].periodLength = periodLengthToBe
      this.state.history[this.state.history.length - 1].cycleLength = cycleLengthToBe
      return
    }
    const cycleDay = inputDay.diff(closetCycle.cycleStartDate, 'days')
    const cycleLength = closetCycle.cycleLength
    // if cycleDay is greater than cycleLength /2 and period length to be is less than 11
    //  adjust this history endDate and cycleLength and start of the history one less (ie index -1)

    if (cycleDay >= Math.round(cycleLength / 2)) {
      const currentCycleLengthToBe = inputDay.diff(closetCycle.cycleStartDate, 'days')
      const morePresentHistoryCycle = this.state.history[indexMorePresent]
      const daysFromStart = morePresentHistoryCycle
        ? inputDay.diff(morePresentHistoryCycle.cycleStartDate, 'days')
        : 0

      if (currentCycleLengthToBe < closetCycle.periodLength + minBufferBetweenCycles) {
        errorCallBack('too_close')
        return
      }
      if (
        morePresentHistoryCycle &&
        morePresentHistoryCycle.periodLength + -daysFromStart > maxPeriodLength
      ) {
        errorCallBack('period_too_long')
        return
      }
      const updateHistoryThisCycle = {
        ...closetCycle,
        cycleEndDate: inputDay.clone().subtract(1, 'days'),
        cycleLength: currentCycleLengthToBe,
      }
      this.state.history[closestIndex] = updateHistoryThisCycle
      if (morePresentHistoryCycle && morePresentHistoryCycle.cycleStartDate) {
        const updateHistoryNextCycle = {
          ...morePresentHistoryCycle,
          cycleStartDate: inputDay,
          cycleLength: morePresentHistoryCycle.cycleLength += -daysFromStart,
          periodLength: morePresentHistoryCycle.periodLength += -daysFromStart,
        }
        this.state.history[indexMorePresent] = updateHistoryNextCycle
      }
    }
    // if cycleDay is 1 and period length to be is less than max and greater than 1
    //  adjust this history start date and period length, adjust history one forwards (if existing) cycleEndDate
    if (cycleDay < closetCycle.periodLength / 2) {
      const daysFromRelevantStart = inputDay.diff(closetCycle.cycleStartDate, 'days')
      const morePastHistoryCycle = this.state.history[indexMorePast]
      if (
        this.state.history[closestIndex].periodLength + Math.abs(daysFromRelevantStart) <
        minPeriodLength
      ) {
        // errorCallBack('period_too_short')
        return
      }

      this.state.history[closestIndex].cycleStartDate = inputDay
      this.state.history[closestIndex].cycleLength += -daysFromRelevantStart
      this.state.history[closestIndex].periodLength += -daysFromRelevantStart
      // check if there is more history to account for
      if (morePastHistoryCycle) {
        this.state.history[indexMorePast].cycleEndDate = inputDay.clone().subtract(1, 'days')
        this.state.history[indexMorePast].cycleLength = inputDay.diff(
          this.state.history[indexMorePast].cycleStartDate,
          'days',
        )
      }
    }
  }

  private _adjustMenstruatingHistoryHandler(inputDay, errorCallBack) {
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')
    const relevantCycleHistoryEntry = this._getClosetCycleHistoryInfo(inputDay).closetCycle
    if (daysFromStart < 0 && !_.isEmpty(relevantCycleHistoryEntry)) {
      const lengthToBe = inputDay.diff(relevantCycleHistoryEntry.cycleStartDate, 'days') + 1
      if (lengthToBe > maxPeriodLength) {
        errorCallBack('period_too_long')
        return
      }
      if (lengthToBe < 1) {
        // errorCallBack('period_too_short')
        return
      }
      relevantCycleHistoryEntry.periodLength = lengthToBe
    }
  }
}
// +=+=+=+=+==+=+=+=+=+=+=+=+= Array Average +=+=+=++=+=+=+=+=+==+=+==+=+==+=+=

const arrayAverage = (arr) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}
