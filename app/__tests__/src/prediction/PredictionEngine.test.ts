import moment from 'moment'
import { PredictionEngine } from '../../../src/prediction/PredictionEngine'
import { PredictionState } from '../../../src/prediction/PredictionState'

describe('PredictionEngine - cycle length rounding', () => {
  it('rounds a non-integer smaCycleLength (e.g. Bayesian posterior mean) to a whole number', () => {
    const state = PredictionState.fromData({
      isActive: true,
      startDate: moment().startOf('day').subtract(40, 'days'),
      periodLength: 5,
      cycleLength: 28,
      smaCycleLength: 28.437291, // non-integer, as returned by the prediction API
      smaPeriodLength: 5.1,
      history: [],
    })
    const engine = PredictionEngine.fromState(state)

    // Move far enough into the future that predictDay uses smartPrediction values
    const futureDay = moment().startOf('day').add(60, 'days')
    const info = engine.predictDay(futureDay)

    expect(Number.isInteger(info.cycleLength)).toBe(true)
    expect(Number.isInteger(info.periodLength)).toBe(true)
  })

  it('rounds non-integer history entry lengths when looking up a history day', () => {
    const state = PredictionState.fromData({
      isActive: true,
      startDate: moment().startOf('day'),
      periodLength: 5,
      cycleLength: 28,
      smaCycleLength: 28,
      smaPeriodLength: 5,
      history: [
        {
          cycleStartDate: moment().startOf('day').subtract(30, 'days'),
          cycleEndDate: moment().startOf('day').subtract(3, 'days'),
          periodLength: 4.6,
          cycleLength: 27.2,
        },
      ],
    })
    const engine = PredictionEngine.fromState(state)

    const historyDay = moment()
      .startOf('day')
      .subtract(29, 'days')
    const info = engine.predictDay(historyDay)

    expect(Number.isInteger(info.cycleLength)).toBe(true)
    expect(Number.isInteger(info.periodLength)).toBe(true)
  })
})

describe('PredictionEngine - crash safety on sparse/edge-case history', () => {
  it('does not throw when adjusting history start date with an empty history array', () => {
    const state = PredictionState.fromData({
      isActive: true,
      startDate: moment().startOf('day'),
      periodLength: 5,
      cycleLength: 28,
      history: [], // no history yet - this used to crash on history[-1]
    })
    const engine = PredictionEngine.fromState(state)

    const inputDay = moment().startOf('day').subtract(90, 'days')

    expect(() => {
      engine.userInputDispatch({
        type: 'history-start-adjust',
        inputDay,
        errorCallBack: () => null,
        getPredictedCycles: () => null,
      })
    }).not.toThrow()
  })

  it('calls errorCallBack instead of crashing when history is empty', () => {
    const state = PredictionState.fromData({
      isActive: true,
      startDate: moment().startOf('day'),
      periodLength: 5,
      cycleLength: 28,
      history: [],
    })
    const engine = PredictionEngine.fromState(state)
    const errorCallBack = jest.fn()

    engine.userInputDispatch({
      type: 'history-start-adjust',
      inputDay: moment().startOf('day').subtract(90, 'days'),
      errorCallBack,
      getPredictedCycles: () => null,
    })

    expect(errorCallBack).toHaveBeenCalledWith('too_far_behind')
  })

  it('rolls back to the previous state and reports an error if a handler throws unexpectedly', () => {
    const state = PredictionState.fromData({
      isActive: true,
      startDate: moment().startOf('day'),
      periodLength: 5,
      cycleLength: 28,
      history: [],
    })
    const engine = PredictionEngine.fromState(state)
    const errorCallBack = jest.fn()

    // Force an internal handler to throw to verify the dispatch-level safety net
    // catches it, rolls back state, and reports an error instead of crashing.
    const engineWithPrivateAccess = engine as unknown as {
      _adjustCurrentStartDateHandler: () => void
    }
    const originalHandler = engineWithPrivateAccess._adjustCurrentStartDateHandler
    engineWithPrivateAccess._adjustCurrentStartDateHandler = () => {
      throw new Error('simulated unexpected failure')
    }

    expect(() => {
      engine.userInputDispatch({
        type: 'current-start-adjust',
        inputDay: moment().startOf('day'),
        errorCallBack,
        getPredictedCycles: () => null,
      })
    }).not.toThrow()

    expect(errorCallBack).toHaveBeenCalledWith('something_went_wrong')

    engineWithPrivateAccess._adjustCurrentStartDateHandler = originalHandler
  })
})

describe('PredictionEngine - calculateStatusForDateRange', () => {
  it('marks verified period days correctly using the optimized O(1) lookup', () => {
    const startDate = moment().startOf('day').subtract(10, 'days')
    const state = PredictionState.fromData({
      isActive: true,
      startDate,
      periodLength: 5,
      cycleLength: 28,
      history: [],
    })
    const engine = PredictionEngine.fromState(state)

    // verifiedPeriodsData is keyed by YYYYMMDD (toShortISO format, no dashes)
    const verifiedDateMoment = startDate.clone().add(1, 'days')
    const verifiedDateKey = verifiedDateMoment.format('YYYYMMDD')
    const verifiedPeriodsData = {
      [verifiedDateKey]: { periodDay: true },
    }

    const markedDates = engine.calculateStatusForDateRange(
      startDate,
      startDate.clone().add(5, 'days'),
      verifiedPeriodsData,
      true,
    )

    const displayKey = verifiedDateMoment.format('YYYY-MM-DD')
    expect(markedDates[displayKey]).toBeDefined()
    expect(markedDates[displayKey].selectedColor).toBe('#E3629B') // verified onPeriod color
  })

  it('does not mark a date as verified when it is absent from verifiedPeriodsData', () => {
    const startDate = moment().startOf('day').subtract(10, 'days')
    const state = PredictionState.fromData({
      isActive: true,
      startDate,
      periodLength: 5,
      cycleLength: 28,
      history: [],
    })
    const engine = PredictionEngine.fromState(state)

    const markedDates = engine.calculateStatusForDateRange(
      startDate,
      startDate.clone().add(5, 'days'),
      {},
      true,
    )

    const dayOne = startDate.clone().add(1, 'days').format('YYYY-MM-DD')
    // onPeriod but not verified -> the "unverified" marker style
    expect(markedDates[dayOne].selectedColor).toBe('#fff')
  })
})
