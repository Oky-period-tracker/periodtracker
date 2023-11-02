import moment from 'moment'
import { PredictionEngine } from '../../src/prediction/PredictionEngine'
import { PredictionState } from '../../src/prediction/PredictionState'

const history = [
  {
    cycleStartDate: moment.utc('01-01-2020', 'DD-MM-YYYY'),
    cycleEndDate: moment.utc('28-01-2020', 'DD-MM-YYYY'),
    periodLength: 6,
    cycleLength: 28,
  },
  {
    cycleStartDate: moment.utc('01-12-2019', 'DD-MM-YYYY'),
    cycleEndDate: moment.utc('30-12-2019', 'DD-MM-YYYY'),
    periodLength: 2,
    cycleLength: 30,
  },
  {
    cycleStartDate: moment.utc('01-11-2019', 'DD-MM-YYYY'),
    cycleEndDate: moment.utc('30-11-2019', 'DD-MM-YYYY'),
    periodLength: 2,
    cycleLength: 30,
  },
  {
    cycleStartDate: moment.utc('01-10-2019', 'DD-MM-YYYY'),
    cycleEndDate: moment.utc('30-10-2019', 'DD-MM-YYYY'),
    periodLength: 2,
    cycleLength: 30,
  },
]

const stateWithHistory = PredictionState.fromData({
  history,
})

const stateWithHistoryAndCurrentCycle = PredictionState.fromData({
  startDate: moment.utc().startOf('day').subtract(5, 'days'),
  periodLength: 5,
  cycleLength: 30,
  history,
})

const newCyclePrimedCycle = PredictionState.fromData({
  startDate: moment.utc().startOf('day').subtract(20, 'days'),
  periodLength: 5,
  cycleLength: 30,
  history,
})

it('Setting State and Getting State', () => {
  const predictor = PredictionEngine.fromState(stateWithHistory)
  expect(predictor.getPredictorState().history).toBe(history)
})

it('Checking Status of known history Days to be true with main engine', () => {
  const predictor = PredictionEngine.fromState(stateWithHistory)
  const dayToTest = moment.utc('06-01-2020', 'DD-MM-YYYY')
  expect(predictor.predictDay(dayToTest).onPeriod).toBe(true)
})

it('Checking Status of known history Days to be false with main engine', () => {
  const predictor = PredictionEngine.fromState(stateWithHistory)
  const dayToTest = moment.utc('08-01-2020', 'DD-MM-YYYY')
  expect(predictor.predictDay(dayToTest).onPeriod).toBe(false)
})

// TODO: FIXME
// it('Date Range known to be empty', () => {
//   const predictor = PredictionEngine.fromState(stateWithHistory)
//   const startDate = moment.utc('01-11-2019', 'DD-MM-YYYY')
//   const endDate = moment.utc('20-11-2019', 'DD-MM-YYYY')
//   const verifiedDates = []
//   const futurePredictionStatus = true
//   expect(
//     predictor.calculateStatusForDateRange(
//       startDate,
//       endDate,
//       verifiedDates,
//       futurePredictionStatus,
//     ),
//   ).toStrictEqual({})
// })

it('Date Range somewhere in the future that should not be empty', () => {
  const predictor = PredictionEngine.fromState(stateWithHistory)
  const startDate = moment.utc('01-11-2022', 'DD-MM-YYYY')
  const endDate = moment.utc('23-12-2022', 'DD-MM-YYYY')
  const verifiedDates = []
  const futurePredictionStatus = true
  expect(
    predictor.calculateStatusForDateRange(
      startDate,
      endDate,
      verifiedDates,
      futurePredictionStatus,
    ),
  ).toBeTruthy()
})

it('User Input change menstruation', () => {
  const predictor = PredictionEngine.fromState(stateWithHistoryAndCurrentCycle)
  const userInputDay = moment.utc().startOf('day').add(2, 'days')
  predictor.userInputDispatch({
    type: 'adjust-mens-end',
    inputDay: userInputDay,
  })
  expect(predictor.predictDay(userInputDay).daysLeftOnPeriod).toStrictEqual(0)
})

// TODO: FIXME
// it('User Input history adjust', () => {
//   const predictor = PredictionEngine.fromState(stateWithHistoryAndCurrentCycle)
//   const userInputDay = moment.utc().startOf('day').subtract(6, 'days')
//   predictor.userInputDispatch({
//     type: 'current-start-adjust',
//     inputDay: userInputDay,
//   })
//   const result = predictor.predictDay(userInputDay).onPeriod
//   expect(result).toBe(true)
// })

it('User Input future adjust', () => {
  const predictor = PredictionEngine.fromState(stateWithHistoryAndCurrentCycle)
  const userInputDay = moment.utc().startOf('day').add(30, 'days')
  const testDay = moment.utc().startOf('day').add(28, 'days')
  predictor.userInputDispatch({
    type: 'future-start-adjust',
    inputDay: userInputDay,
  })
  expect(predictor.predictDay(testDay).daysUntilNextPeriod).toBe(1)
})

it('User Input start next cycle', () => {
  const predictor = PredictionEngine.fromState(newCyclePrimedCycle)
  const userInputDay = moment.utc().startOf('day')
  const testDay = moment.utc().startOf('day').add(1, 'days')
  predictor.userInputDispatch({
    type: 'start-next-cycle',
    inputDay: userInputDay,
  })
  expect(predictor.predictDay(testDay).cycleDay).toBe(2)
})

it('User Input add next cycle history', () => {
  const predictor = PredictionEngine.fromState(newCyclePrimedCycle)
  const userInputDay = moment.utc().startOf('day')
  const testDay = moment.utc().startOf('day').add(1, 'days')
  predictor.userInputDispatch({
    type: 'add-new-cycle-history',
    inputDay: userInputDay,
  })
  expect(predictor.predictDay(testDay).cycleDay).toBe(2)
})
