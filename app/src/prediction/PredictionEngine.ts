// TODO:
//@ts-nocheck
// This is also ignored by eslint via config file
import _ from 'lodash'
import moment, { Moment } from 'moment'
import { PredictionState } from './PredictionState'

export interface PredictionDayInfo {
  onPeriod: boolean
  onFertile: boolean
  date: moment.Moment
  cycleDay: number
  daysLeftOnPeriod: number
  cycleStart: moment.Moment
  daysUntilNextPeriod: number
  cycleLength: number
  periodLength: number
  isVerified: boolean
}

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
  public predictDay(
    inputDay: Moment,
    isVerified: boolean = false,
    selectedDayInfo: any = {},
  ): PredictionDayInfo {
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
    const diffDays = inputDay.diff(cycleStart, 'days') // number of days since start of cycle
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
      onPeriod = true
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

  public calculateStatusForDateRange(
    startDate: Moment,
    endDate: Moment,
    verifiedPeriodsData: any,
    hasFuturePredictionActive: boolean,
  ) {
    const loop = moment(startDate)
    let markedDates = {}
    const today = moment().startOf('day')
    while (loop <= endDate) {
      const newDate = moment(loop.date(loop.date() + 1)).startOf('day')

      const isToday = newDate.isSame(today)

      const { onPeriod, onFertile, date } = this.predictDay(newDate)

      if (isToday) {
        const todayValue = {
          selected: true,
          selectedColor: '#FF8C00',
          selectedTextColor: '#fff',
        }

        const newEntry = date.format('YYYY-MM-DD')
        markedDates = {
          ...markedDates,
          [newEntry]: todayValue,
        }
        continue
      }

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
        let newValue = {
          selected: true,
          selectedColor: '#91d9e2',
          selectedTextColor: '#fff',
        }

        let isFutureDate = null
        if (onPeriod && dateExists) {
          newValue = {
            selected: true,
            selectedColor: '#E3629B',
            selectedTextColor: '#fff',
          }
        } else if (onPeriod && !dateExists) {
          newValue = {
            selected: true,
            marked: true,
            selectedColor: '#fff',
            selectedTextColor: '#E3629B',
            dotColor: '#e3629b',
          }
        } else if (onFertile) {
          newValue = {
            selected: true,
            selectedColor: '#3ea4dd',
            selectedTextColor: '#fff',
          }
        } else {
          newValue = {
            selected: true,
            marked: true,
            selectedColor: '#fff',
            selectedTextColor: '#E3629B',
            dotColor: '#e3629b',
          }
        }

        if (!hasFuturePredictionActive) {
          if (!_.isEmpty(this.state.actualCurrentStartDate)) {
            const checkStartDate = this.state.actualCurrentStartDate?.cycleStart
              ? this.state.actualCurrentStartDate.cycleStart
              : this.state.actualCurrentStartDate.startDate
            isFutureDate = moment(newEntry).isAfter(
              moment(checkStartDate).add(this.state.actualCurrentStartDate.periodLength, 'days'),
            )
          }

          if (isFutureDate) {
            newValue = {
              selected: true,
              selectedColor: '#91d9e2',
              selectedTextColor: '#fff',
            }
          }
        }

        markedDates = {
          ...markedDates,
          [newEntry]: newValue,
        }
      } else {
        const newEntry = date.format('YYYY-MM-DD')
        markedDates = {
          ...markedDates,
          [newEntry]: {
            selected: true,
            selectedColor: '#91d9e2',
            selectedTextColor: '#fff',
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

  public userInputDispatch({
    type,
    inputDay,
    errorCallBack = (err: string) => null,
    getPredictedCycles = (flag: boolean) => null,
  }) {
    this.state.isActive = true
    switch (type) {
      case 'adjust-mens-end':
        this._adjustMenstruatingHandler(inputDay, errorCallBack, getPredictedCycles)
        break
      case 'start-next-cycle':
        this._startedEarlyHandler(inputDay, errorCallBack, getPredictedCycles)
        break
      case 'current-start-adjust':
        this._adjustCurrentStartDateHandler(inputDay, errorCallBack, getPredictedCycles)
        break
      case 'history-start-adjust':
        this._adjustHistoryStartDateHandler(inputDay, errorCallBack, getPredictedCycles)
        break
      case 'adjust-mens-end-history':
        this._adjustMenstruatingHistoryHandler(inputDay, errorCallBack, getPredictedCycles)
        break
      case 'future-start-adjust':
        this._adjustFutureStartDateHandler(inputDay, errorCallBack, getPredictedCycles)
        break
      case 'adjust-future-mens-end':
        this._adjustFutureMenstruatingHandler(inputDay, errorCallBack, getPredictedCycles)
        break
      case 'add-new-cycle-history':
        this._addNewCycleInHistory(inputDay, errorCallBack, getPredictedCycles)
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
    if (!_.isEmpty(this.state.actualCurrentStartDate)) {
      this.state.futurePredictionStatus = false
    }
    const tempCurrentCycle = { ...this.state.actualCurrentStartDate }
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
        this._cycleCompletion(completionDay, null)
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
        if (
          (!this.state.futurePredictionStatus &&
            moment(dayToCheck).isSameOrBefore(moment(tempCurrentCycle.cycleStart), 'day')) ||
          this.state.futurePredictionStatus
        ) {
          const completionDay = this.predictDay(dayToCheck).cycleStart
          this._cycleCompletion(completionDay, numberOfCyclesAheadOfCurrent)
        } else {
          this.state.currentCycle = {
            startDate: moment(tempCurrentCycle.cycleStart),
            periodLength: tempCurrentCycle.periodLength,
            cycleLength: moment().diff(tempCurrentCycle.cycleStart, 'days') + 7,
          }
        }
        i += 1
      }
    }
  }

  private _adjustMenstruatingHandler(inputDay, errorCallBack, getPredictedCycles) {
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')
    // MARK:- If selected day is the only period day of current cycle (i.e. period length of current cycle is 1)
    if (daysFromStart < 0 && this.state.currentCycle.periodLength === 1) {
      if (this.state.history.length) {
        const newCurrentCycle = {
          startDate: this.state.history[0].cycleStartDate,
          cycleLength: this.state.history[0].cycleLength + this.state.currentCycle.cycleLength,
          periodLength: this.state.history[0].periodLength,
        }
        this.state.history.shift()
        this.state.currentCycle = newCurrentCycle
        this.state.actualCurrentStartDate = newCurrentCycle
        getPredictedCycles(true)
        return
      }

      this.state.isActive = false
      getPredictedCycles(true)
      return
    }

    // MARK:- Check if selected date is after period days of currentcycle
    if (daysFromStart - this.state.currentCycle.periodLength >= 2) {
      // MARK:- Add new cycle as current cycle and current cycle will be shifted to history array
      const newHistoryCyle = {
        cycleStartDate: this.state.currentCycle.startDate,
        cycleEndDate: inputDay.clone().subtract(1, 'days'),
        periodLength: this.state.currentCycle.periodLength,
        cycleLength: inputDay.diff(this.state.currentCycle.startDate, 'days'),
      }
      const newCurrentCycle = {
        startDate: inputDay,
        periodLength: 1,
        cycleLength:
          this.state.currentCycle.cycleLength -
          inputDay.diff(this.state.currentCycle.startDate, 'days'),
      }

      this.state.history.unshift(newHistoryCyle)
      this.state.currentCycle = newCurrentCycle
      this.state.actualCurrentStartDate = newCurrentCycle
      getPredictedCycles(true)
      return
    }

    // MARK:- if difference between selected date and last period day of current cycle is less than 2, than extend current cycle period length
    if (daysFromStart < this.state.currentCycle.periodLength / 2) {
      const tempDate = moment(inputDay).add(1, 'days')

      if (daysFromStart <= 0) {
        const daysFromCurrentCycle = this.state.currentCycle.startDate.diff(tempDate, 'days')
        const remainingPeriodLenghth =
          this.state.currentCycle.periodLength + daysFromCurrentCycle - 1
        if (tempDate.clone().add(1, 'days').isAfter(moment()) && remainingPeriodLenghth > 0) {
          // MARK:- If there is no history cycle and user is setting current cycle
          if (!this.state.history.length) {
            const updateNewCurrentcycle = {
              startDate: inputDay,
              cycleLength: this.state.currentCycle.cycleLength,
              periodLength: 1,
            }

            this.state.currentCycle = updateNewCurrentcycle
            this.state.actualCurrentStartDate = updateNewCurrentcycle
            getPredictedCycles(true)
            return
          }

          const updateNewCurrentCycle = {
            startDate: this.state.history[0].cycleStartDate,
            cycleLength: tempDate.diff(this.state.history[0].cycleStartDate, 'days') + 1,
            periodLength: this.state.history[0].periodLength,
          }

          this.state.currentCycle = updateNewCurrentCycle
          this.state.history.shift()
          this.state.actualCurrentStartDate = updateNewCurrentCycle
          getPredictedCycles(true)
          return
        }

        // MARK:- If selected date is today's date and there is no history cycles, current cycle will start from today itself
        if (moment(inputDay).isSame(moment().format('YYYY-MM-DD')) && !this.state.history.length) {
          const updateCurrentCycle = {
            startDate: inputDay,
            cycleLength: this.state.currentCycle.cycleLength,
            periodLength: 1,
          }

          this.state.currentCycle = updateCurrentCycle
          this.state.actualCurrentStartDate = updateCurrentCycle
          getPredictedCycles(true)
          return
        }
      }
    }
    // MARK:- If user is trying to set no the 1st period day of current cycle and there is no history
    if (daysFromStart - this.state.currentCycle.periodLength < 2) {
      if (daysFromStart < 0) {
        const updateExistingCurrentCycle = {
          startDate: this.state.currentCycle.startDate.clone().add(1, 'days'),
          periodLength: this.state.currentCycle.periodLength + daysFromStart,
          cycleLength: this.state.currentCycle.cycleLength + daysFromStart,
        }

        this.state.currentCycle = updateExistingCurrentCycle
        this.state.actualCurrentStartDate = updateExistingCurrentCycle
        getPredictedCycles(true)
        return
      }
      const updateCurrentCycle = {
        ...this.state.currentCycle,
        periodLength: daysFromStart + 1,
      }
      this.state.currentCycle = updateCurrentCycle
      this.state.actualCurrentStartDate = updateCurrentCycle
      getPredictedCycles(true)
      return
    }
  }

  private _startedEarlyHandler(inputDay, errorCallBack, getPredictedCycles) {
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')
    if (daysFromStart > 0 && daysFromStart < this.state.currentCycle.cycleLength) {
      this._cycleCompletion(inputDay, null)
    }
    if (daysFromStart < 0) {
      this._adjustCurrentStartDateHandler(inputDay, errorCallBack, getPredictedCycles) // in the event the user shifted the current cycle forward
    }
  }

  private _addNewCycleInHistory(inputDay, errorCallBack, getPredictedCycles) {
    const relevantCycleHistoryEntry = this._getClosetCycleHistoryInfo(inputDay)
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')
    // MARK:- Add new cycle in the history (which will become 1st cycle)
    const tempDate = moment(this.state.currentCycle.startDate).add(1, 'days')

    if (_.isEmpty(relevantCycleHistoryEntry.closetCycle)) {
      const tempHistoryArr = [...this.state.history]
      // MARK:- if there are elements in history and date is selected before the 1st history cycle
      if (tempHistoryArr.length) {
        if (inputDay.diff(tempHistoryArr[tempHistoryArr.length - 1].cycleStartDate, 'days') >= -4) {
          const updateLastHistoryCycle = {
            ...tempHistoryArr[tempHistoryArr.length - 1],
            cycleStartDate: inputDay,
            cycleLength:
              tempHistoryArr[tempHistoryArr.length - 1].cycleStartDate.diff(inputDay, 'days') +
              tempHistoryArr[tempHistoryArr.length - 1].cycleLength,
            periodLength:
              tempHistoryArr[tempHistoryArr.length - 1].periodLength +
              -inputDay.diff(tempHistoryArr[tempHistoryArr.length - 1].cycleStartDate, 'days'),
          }

          tempHistoryArr[tempHistoryArr.length - 1] = updateLastHistoryCycle
          this.state.history = tempHistoryArr
          getPredictedCycles(true)
          return
        }

        const addNewHisCycle = {
          cycleStartDate: inputDay,
          cycleEndDate: tempHistoryArr[tempHistoryArr.length - 1].cycleStartDate
            .clone()
            .subtract(1, 'days'),
          cycleLength: tempHistoryArr[tempHistoryArr.length - 1].cycleStartDate.diff(
            inputDay,
            'days',
          ),
          periodLength: 1,
        }

        tempHistoryArr.push(addNewHisCycle)
        this.state.history = [...tempHistoryArr]
        getPredictedCycles(true)
        return
      }
      // MARK:- if there is no current cycle
      if (_.isEmpty(this.state.currentCycle)) {
        const addNewCurrentCycle = {
          startDate: inputDay,
          periodLength: 1,
          cycleLength: 28,
        }
        this.state.currentCycle = addNewCurrentCycle
        getPredictedCycles(true)
        return
      }
      // MARK:- if there is current cycle
      if (moment(this.state.currentCycle.startDate).isSame(moment().format('YYYY-MM-DD'))) {
        if (this.state.currentCycle.periodLength >= 1) {
          // MARK:- If there no history, but user has set current date as period of current cycle(i.e, current cycle has started and it has period length)
          if (daysFromStart >= -4 && !this.state.history.length) {
            const updateCurrentCycle = {
              startDate: inputDay,
              cycleLength: this.state.currentCycle.cycleLength + -daysFromStart,
              periodLength: this.state.currentCycle.periodLength + -daysFromStart,
            }

            this.state.currentCycle = updateCurrentCycle
            getPredictedCycles(true)
            return
          }
          {
            const addHistoryCycle = {
              cycleStartDate: inputDay,
              cycleEndDate: this.state.currentCycle.startDate.clone().subtract(1, 'days'),
              cycleLength: this.state.currentCycle.startDate.diff(inputDay, 'days'),
              periodLength: 1,
            }
            tempHistoryArr.push(addHistoryCycle)
            this.state.history = [...tempHistoryArr]
            getPredictedCycles(true)
            return
          }
        }
        {
          // MARK:- If user did not add any info at the time of sign up and all data for periods was N/A on journey completion, then it sets current cycle from current date but doesn't show onPeriod or onFertile
          let currentCycleLength = 28
          if (this.state.currentCycle.startDate.diff(inputDay, 'days') > 21) {
            currentCycleLength = this.state.currentCycle.startDate.diff(inputDay, 'days') + 7
          }
          const addNewCurrentCycle = {
            startDate: inputDay,
            periodLength: 1,
            cycleLength: currentCycleLength,
          }

          this.state.currentCycle = addNewCurrentCycle
          getPredictedCycles(true)
          return
        }
      }
      {
        // MARK:- If user has selected date
        if (daysFromStart >= -4 && !this.state.history.length) {
          const updateCurrentCycle = {
            startDate: inputDay,
            cycleLength: this.state.currentCycle.cycleLength + -daysFromStart,
            periodLength: this.state.currentCycle.periodLength + -daysFromStart,
          }

          this.state.currentCycle = updateCurrentCycle
          getPredictedCycles(true)
          return
        }
        const addHistoryCycle = {
          cycleStartDate: inputDay,
          cycleEndDate: this.state.currentCycle.startDate.clone().subtract(1, 'days'),
          cycleLength: this.state.currentCycle.startDate.diff(inputDay, 'days'),
          periodLength: 1,
        }
        tempHistoryArr.push(addHistoryCycle)
        this.state.history = [...tempHistoryArr]
        getPredictedCycles(true)
        return
      }

      // TODO: This code is unreachable ?
      /*     const addNewHistoryCycle = {
        cycleStartDate: inputDay,
        cycleEndDate: tempHistoryArr[tempHistoryArr.length - 1].cycleStartDate
          .clone()
          .subtract(1, 'days'),
        cycleLength: tempHistoryArr[tempHistoryArr.length - 1].cycleStartDate.diff(
          inputDay,
          'days',
        ),
        periodLength: 1,
      }
      tempHistoryArr.push(addNewHistoryCycle)
      this.state.history = [...tempHistoryArr]
      getPredictedCycles(true)
      return */
    }

    const daysFromInputToCloset = inputDay.diff(
      this.state.history[relevantCycleHistoryEntry.closestIndex].cycleStartDate,
      'days',
    )
    // MARK:-- If selected date is between last history cycle and current cycle
    if (moment(inputDay).isAfter(this.state.history[0].cycleStartDate)) {
      // check conditions to add new cylce between 2 history cyles

      const daysFromCurrentCycle = inputDay.diff(this.state.currentCycle.startDate, 'days')
      if (
        daysFromCurrentCycle >= -4 &&
        daysFromInputToCloset - this.state.history[0].periodLength >= 2
      ) {
        const updateLastHistoryCycle = {
          cycleStartDate: this.state.history[0].cycleStartDate,
          cycleEndDate: inputDay.clone().subtract(1, 'days'),
          cycleLength: inputDay.diff(this.state.history[0].cycleStartDate, 'days'),
          periodLength: this.state.history[0].periodLength,
        }
        const updateCurrentCycle = {
          ...this.state.currentCycle,
          startDate: inputDay,
          cycleLength: this.state.currentCycle.cycleLength + -daysFromCurrentCycle,
          periodLength: this.state.currentCycle.periodLength + -daysFromCurrentCycle,
        }

        this.state.history[0] = updateLastHistoryCycle
        this.state.currentCycle = updateCurrentCycle
        getPredictedCycles(true)
        return
      }
      if (daysFromInputToCloset - this.state.history[0].periodLength < 2) {
        // If there is no day left between last history period cycle and current cyle, then remove last history cylce and update current cycle

        if (inputDay.diff(this.state.currentCycle.startDate, 'days') >= 0) {
          const updateCurrentCycle1 = {
            cycleEndDate: this.state.history[0].cycleEndDate,
            cycleStartDate: this.state.history[0].cycleStartDate,
            cycleLength: this.state.history[0].cycleLength,
            periodLength: inputDay.diff(this.state.history[0].cycleStartDate, 'days') + 1,
          }
          const updateCurrentCycle = {
            ...this.state.currentCycle,
            startDate: this.state.history[0].cycleStartDate,
            cycleLength: this.state.currentCycle.cycleLength + this.state.history[0].cycleLength,
            periodLength:
              this.state.currentCycle.periodLength +
              inputDay.diff(this.state.history[0].cycleStartDate, 'days') +
              1,
          }
          this.state.history.shift()
          this.state.currentCycle = updateCurrentCycle
          getPredictedCycles(true)
          return
        }

        const updateHistoryCycle = {
          cycleEndDate: this.state.history[0].cycleEndDate,
          cycleStartDate: this.state.history[0].cycleStartDate,
          cycleLength: this.state.history[0].cycleLength,
          periodLength: inputDay.diff(this.state.history[0].cycleStartDate, 'days') + 1,
        }
        this.state.history[0] = updateHistoryCycle
        getPredictedCycles(true)

        return
      }

      const tempHistoryArr = [...this.state.history]
      const addNewHistoryCycle = {
        cycleStartDate: inputDay,
        cycleEndDate: this.state.currentCycle.startDate.clone().subtract(1, 'days'),
        cycleLength: this.state.currentCycle.startDate.diff(inputDay, 'days'),
        periodLength: 1,
      }
      const updateLastHitoryCycle = {
        cycleStartDate: tempHistoryArr[0].cycleStartDate,
        cycleEndDate: inputDay.clone().subtract(1, 'days'),
        cycleLength: inputDay.diff(tempHistoryArr[0].cycleStartDate, 'days'),
        periodLength: tempHistoryArr[0].periodLength,
      }
      tempHistoryArr[0] = updateLastHitoryCycle
      tempHistoryArr.unshift(addNewHistoryCycle)
      this.state.history = [...tempHistoryArr]
      getPredictedCycles(true)
      return
    }

    const periodLengthOfClosestCycle = this.state.history[relevantCycleHistoryEntry.closestIndex]
      .periodLength

    // check conditions to add new cylce between 2 history cyles
    const daysFromNextCycle = inputDay.diff(
      this.state.history[relevantCycleHistoryEntry.closestIndex - 1].cycleStartDate,
      'days',
    )
    const nextHistoryCycle = this.state.history[relevantCycleHistoryEntry.closestIndex - 1]
    const periodLengthOfNextCycle = this.state.history[relevantCycleHistoryEntry.closestIndex - 1]
      .periodLength
    ///// --------- selected date is after 1st entery of period in
    if (daysFromInputToCloset > 0) {
      // MARK:-To shift period start day --- If they mark a day up to 4 days before their period is due to start as a period day, then their whole period shifts and starts on that day, Example: period 1st to 4th Feb, they tap on 28th, then their period is moved to 28th till 31st Jan
      if (daysFromNextCycle >= -4 && daysFromInputToCloset - periodLengthOfClosestCycle >= 2) {
        const tempHistoryArr = [...this.state.history]
        const updateNextHistoryCycle = {
          cycleStartDate: inputDay,
          cycleEndDate: nextHistoryCycle.cycleEndDate,
          cycleLength: nextHistoryCycle.cycleLength - daysFromNextCycle,
          periodLength: nextHistoryCycle.periodLength - daysFromNextCycle,
        }
        const updatePreviousCycle = {
          ...relevantCycleHistoryEntry.closetCycle,
          cycleEndDate: inputDay.clone().subtract(1, 'days'),
          cycleLength: inputDay.diff(relevantCycleHistoryEntry.closetCycle.cycleStartDate, 'days'),
        }
        tempHistoryArr[relevantCycleHistoryEntry.closestIndex - 1] = updateNextHistoryCycle
        tempHistoryArr[relevantCycleHistoryEntry.closestIndex] = updatePreviousCycle
        this.state.history = [...tempHistoryArr]
        getPredictedCycles(true)
        return
      }

      // MARK:- To start a new period --- If they mark a period day three days after their period ended, they will need to manually fill in their period days in between. By default we assume its a new period unless they fill in the days in between. Example: period 1st to 4th Feb, they mark 7th as period, they will need to fill in the 5th and 6th as period days as they don’t fill in automatically.
      if (daysFromInputToCloset - periodLengthOfClosestCycle >= 2) {
        const tempHistoryArr = [...this.state.history]
        const newHistoryEntry = {
          cycleStartDate: inputDay,
          cycleEndDate: relevantCycleHistoryEntry.closetCycle.cycleEndDate,
          cycleLength: Math.abs(
            inputDay.diff(relevantCycleHistoryEntry.closetCycle.cycleEndDate, 'days'),
          ),
          periodLength: 1,
        }
        const updateClosestHistoryCycle = {
          cycleStartDate: relevantCycleHistoryEntry.closetCycle.cycleStartDate,
          cycleEndDate: inputDay.clone().subtract(1, 'days'),
          cycleLength: Math.abs(
            inputDay.diff(relevantCycleHistoryEntry.closetCycle.cycleStartDate, 'days'),
          ),
          periodLength: relevantCycleHistoryEntry.closetCycle.periodLength,
        }
        let deletedTempArr = []
        deletedTempArr = tempHistoryArr.splice(
          relevantCycleHistoryEntry.closestIndex,
          this.state.history.length - 1,
          newHistoryEntry,
        )
        deletedTempArr[0] = updateClosestHistoryCycle
        this.state.history = [...tempHistoryArr, ...deletedTempArr]
        getPredictedCycles(true)
        return
      }
      // MARK:- To extend the period --- If they mark a day as a period day, two days after the period ended. Their period will be extended. Example: period 1st to 4th Feb, they mark 6th as period, the 5th will become a period day
      if (daysFromInputToCloset - periodLengthOfClosestCycle < 2) {
        const tempHistoryArr = [...this.state.history]
        // MARK:- If there is gap between selected day and the next cycle start day. Ex. period 1st to 4th feb and next cycle starts on 8th feb. User selects 6th feb, then period will be extended till 6th and if user manually fills 7th as period then next cycle will be merged else will be considered 2 . separate cycles
        if (
          inputDay.diff(
            this.state.history[relevantCycleHistoryEntry.closestIndex - 1].cycleStartDate,
            'days',
          ) <= -2
        ) {
          const updateClosestHistoryCycle = {
            cycleStartDate: relevantCycleHistoryEntry.closetCycle.cycleStartDate,
            cycleEndDate: relevantCycleHistoryEntry.closetCycle.cycleEndDate,
            cycleLength: relevantCycleHistoryEntry.closetCycle.cycleLength,
            periodLength:
              inputDay.diff(relevantCycleHistoryEntry.closetCycle.cycleStartDate, 'days') + 1,
          }
          tempHistoryArr[relevantCycleHistoryEntry.closestIndex] = updateClosestHistoryCycle
          this.state.history = [...tempHistoryArr]
          getPredictedCycles(true)
          return
        }
        {
          const updateClosestHistoryCycle = {
            cycleStartDate: relevantCycleHistoryEntry.closetCycle.cycleStartDate,
            cycleEndDate: this.state.history[relevantCycleHistoryEntry.closestIndex - 1]
              .cycleEndDate,
            cycleLength:
              relevantCycleHistoryEntry.closetCycle.cycleLength +
              this.state.history[relevantCycleHistoryEntry.closestIndex - 1].cycleLength,
            periodLength:
              inputDay.diff(relevantCycleHistoryEntry.closetCycle.cycleStartDate, 'days') +
              1 +
              this.state.history[relevantCycleHistoryEntry.closestIndex - 1].periodLength,
          }
          tempHistoryArr[relevantCycleHistoryEntry.closestIndex] = updateClosestHistoryCycle
          tempHistoryArr.splice(relevantCycleHistoryEntry.closestIndex - 1, 1)
          this.state.history = [...tempHistoryArr]
          getPredictedCycles(true)
          return
        }
      }
    }

    return
  }

  private _adjustCurrentStartDateHandler(inputDay, errorCallBack, getPredictedCycles) {
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')
    if (!this.state.history[0]) {
      this.state.currentCycle.startDate = inputDay
      this.state.currentCycle.cycleLength += -daysFromStart
      this.state.currentCycle.periodLength += -daysFromStart
      getPredictedCycles(true)
      return
    }

    // MARK:- If selected day is 1st day of current cycle
    if (daysFromStart === 0) {
      this.state.currentCycle.startDate = this.state.history[0].cycleStartDate
      this.state.currentCycle.cycleLength = this.state.history[0].cycleLength + 1
      this.state.currentCycle.periodLength = this.state.history[0].periodLength
      this.state.history.shift()
      getPredictedCycles(true)
      return
    }
    const daysFromPreviousStart = inputDay.diff(this.state.history[0].cycleStartDate, 'days')
    // ----------- if between current cycle start and last cycle start --------
    if (daysFromStart < 0 && daysFromPreviousStart > 0) {
      const relevantCycleHistoryEntry = this._getClosetCycleHistoryInfo(inputDay)
      if (
        inputDay.diff(this.state.history[0].cycleStartDate, 'days') -
          this.state.history[0].periodLength >=
          5 &&
        inputDay.diff(this.state.currentCycle.startDate, 'days') > -5
      ) {
        this.state.currentCycle.startDate = inputDay
        this.state.currentCycle.cycleLength += -daysFromStart
        this.state.currentCycle.periodLength += -daysFromStart
      } else {
        if (
          inputDay.diff(this.state.history[0].cycleStartDate, 'days') -
            this.state.history[0].periodLength <=
          2
        ) {
          // errorCallBack('too_close_next')
          return
        }
        const updateHistory = {
          ...relevantCycleHistoryEntry.closetCycle,
          periodLength:
            inputDay.diff(relevantCycleHistoryEntry.closetCycle.cycleStartDate, 'days') + 1,
        }
        this.state.history[relevantCycleHistoryEntry.closestIndex] = updateHistory
      }
    }
    // --------- if between current cycle start and next cycle start ----------
    else if (daysFromStart > 0 && daysFromStart < this.state.currentCycle.cycleLength) {
      if (this.state.currentCycle.periodLength + -daysFromStart < 1)
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

  private _adjustFutureStartDateHandler(inputDay, errorCallBack, getPredictedCycles) {
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')
    if (daysFromStart < 50 && daysFromStart > 10) {
      this.state.currentCycle.cycleLength = daysFromStart
    }
  }
  private _adjustFutureMenstruatingHandler(inputDay, errorCallBack, getPredictedCycles) {
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

  private async _cycleCompletion(completionDate, getPredictedCycles) {
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
    // TODO: this is sometimes null ?
    getPredictedCycles?.(true)
  }

  // +=+=+=+=+==+=+=+=+= History Adjust Methods +=+=+=+=+=+=+=+=++=+=+=+=+=+=+=+==+=+=+=+=+

  private _adjustHistoryStartDateHandler(inputDay, errorCallBack, getPredictedCycles) {
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
      getPredictedCycles(true)
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

      if (morePresentHistoryCycle && morePresentHistoryCycle.cycleStartDate) {
        if (inputDay.diff(morePresentHistoryCycle.cycleStartDate, 'days') > -5) {
          if (currentCycleLengthToBe - closetCycle.periodLength >= 7) {
            const updateHistoryNextCycle = {
              ...morePresentHistoryCycle,
              cycleStartDate: inputDay,
              cycleLength: morePresentHistoryCycle.cycleLength += -daysFromStart,
              periodLength: morePresentHistoryCycle.periodLength += -daysFromStart,
            }
            this.state.history[indexMorePresent] = updateHistoryNextCycle
            getPredictedCycles(true)
            return
          }
          {
            const daysFromRelevantStart = inputDay.diff(closetCycle.cycleStartDate, 'days')
            this.state.history[closestIndex].periodLength += -daysFromRelevantStart
            getPredictedCycles(true)
            return
          }
        }

        if (currentCycleLengthToBe - closetCycle.periodLength < 7) {
          const daysFromRelevantStart = inputDay.diff(closetCycle.cycleStartDate, 'days')
          this.state.history[closestIndex].periodLength += -daysFromRelevantStart
          getPredictedCycles(true)
          return
        }
      }
      if (currentCycleLengthToBe < closetCycle.periodLength + minBufferBetweenCycles) {
        errorCallBack('too_close')
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

  private _adjustMenstruatingHistoryHandler(inputDay, errorCallBack, getPredictedCycles) {
    const daysFromStart = inputDay.diff(this.state.currentCycle.startDate, 'days')
    const relevantCycleHistoryEntry = this._getClosetCycleHistoryInfo(inputDay)
    // fetch closet cycle in history, then check if selected date is between 2 hsitory cycles or between history and current cycle
    if (relevantCycleHistoryEntry.closestIndex - 1 >= 0) {
      // if selected date is the 1st period day of cycle
      const tempDate = moment(inputDay).add(1, 'days')

      if (
        tempDate.isSame(
          this.state.history[relevantCycleHistoryEntry.closestIndex - 1].cycleStartDate,
        ) &&
        this.state.history[relevantCycleHistoryEntry.closestIndex - 1].periodLength > 1
      ) {
        const tempHistoryArr = [...this.state.history]
        const updateCurrentHistoryCycle = {
          cycleStartDate: tempDate.clone().add(1, 'days'),
          cycleEndDate: this.state.history[relevantCycleHistoryEntry.closestIndex - 1].cycleEndDate,
          cycleLength: this.state.history[
            relevantCycleHistoryEntry.closestIndex - 1
          ].cycleEndDate.diff(inputDay, 'days'),
          periodLength:
            this.state.history[relevantCycleHistoryEntry.closestIndex - 1].periodLength -
            this.state.history[relevantCycleHistoryEntry.closestIndex - 1].cycleStartDate.diff(
              inputDay,
              'days',
            ),
        }

        const updateClosestHistoryCycle = {
          cycleStartDate: tempHistoryArr[relevantCycleHistoryEntry.closestIndex].cycleStartDate,
          cycleEndDate: tempDate,
          cycleLength:
            relevantCycleHistoryEntry.closetCycle.cycleLength +
            this.state.history[relevantCycleHistoryEntry.closestIndex - 1].cycleStartDate.diff(
              inputDay,
              'days',
            ),
          periodLength: relevantCycleHistoryEntry.closetCycle.periodLength,
        }

        tempHistoryArr[relevantCycleHistoryEntry.closestIndex] = updateClosestHistoryCycle
        tempHistoryArr[relevantCycleHistoryEntry.closestIndex - 1] = updateCurrentHistoryCycle
        this.state.history = [...tempHistoryArr]
        getPredictedCycles(true)
        return
      }
      if (
        tempDate.isSame(
          this.state.history[relevantCycleHistoryEntry.closestIndex - 1].cycleStartDate,
        ) &&
        this.state.history[relevantCycleHistoryEntry.closestIndex - 1].periodLength === 1
      ) {
        const tempHistoryArr = [...this.state.history]
        const updateClosestHistoryCycle = {
          cycleStartDate: tempHistoryArr[relevantCycleHistoryEntry.closestIndex].cycleStartDate,
          cycleEndDate: tempHistoryArr[relevantCycleHistoryEntry.closestIndex - 1].cycleEndDate,
          cycleLength:
            relevantCycleHistoryEntry.closetCycle.cycleLength +
            tempHistoryArr[relevantCycleHistoryEntry.closestIndex - 1].cycleLength,
          periodLength: relevantCycleHistoryEntry.closetCycle.periodLength,
        }

        tempHistoryArr.splice(relevantCycleHistoryEntry.closestIndex - 1, 1)
        tempHistoryArr[relevantCycleHistoryEntry.closestIndex - 1] = updateClosestHistoryCycle
        this.state.history = [...tempHistoryArr]
        getPredictedCycles(true)
        return
      }
    }
    if (daysFromStart < 0 && !_.isEmpty(relevantCycleHistoryEntry.closetCycle)) {
      const lengthToBe =
        inputDay.diff(relevantCycleHistoryEntry.closetCycle.cycleStartDate, 'days') + 1
      if (lengthToBe < 1) {
        // errorCallBack('period_too_short')
        return
      }
      relevantCycleHistoryEntry.closetCycle.periodLength = lengthToBe
    }

    if (daysFromStart < 0 && _.isEmpty(relevantCycleHistoryEntry.closetCycle)) {
      const tempData = this.state.history

      tempData.pop()
      this.state.history = tempData
    }
  }
}
// +=+=+=+=+==+=+=+=+=+=+=+=+= Array Average +=+=+=++=+=+=+=+=+==+=+==+=+==+=+=

const arrayAverage = (arr) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}
