import moment from 'moment'
import { PredictionEngine } from './PredictionEngine'
import { PredictionState } from './PredictionState'

const history = [
  {
    cycleStartDate: moment.utc('01-01-2019', 'DD-MM-YYYY'),
    cycleEndDate: moment.utc('28-01-2019', 'DD-MM-YYYY'),
    periodLength: 6,
    cycleLength: 28,
  },
  {
    cycleStartDate: moment.utc('01-12-2018', 'DD-MM-YYYY'),
    cycleEndDate: moment.utc('30-12-2018', 'DD-MM-YYYY'),
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
  const dayToTest = moment.utc('06-01-2019', 'DD-MM-YYYY')
  expect(predictor.predictDay(dayToTest).onPeriod).toBe(true)
})

it('Checking Status of known history Days to be false with main engine', () => {
  const predictor = PredictionEngine.fromState(stateWithHistory)
  const dayToTest = moment.utc('08-01-2019', 'DD-MM-YYYY')
  expect(predictor.predictDay(dayToTest).onPeriod).toBe(false)
})

it('Date Range known to be empty', () => {
  const predictor = PredictionEngine.fromState(stateWithHistory)
  const startDate = moment.utc('01-11-2018', 'DD-MM-YYYY')
  const endDate = moment.utc('20-11-2018', 'DD-MM-YYYY')
  const verifiedDates = []
  expect(predictor.calculateStatusForDateRange(startDate, endDate, verifiedDates)).toStrictEqual({})
})

it('Date Range somewhere in the future that should not be empty', () => {
  const predictor = PredictionEngine.fromState(stateWithHistory)
  const startDate = moment.utc('01-11-2022', 'DD-MM-YYYY')
  const endDate = moment.utc('23-12-2022', 'DD-MM-YYYY')
  const verifiedDates = []
  expect(predictor.calculateStatusForDateRange(startDate, endDate, verifiedDates)).toBeTruthy()
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

it('User Input history adjust', () => {
  const predictor = PredictionEngine.fromState(stateWithHistoryAndCurrentCycle)
  const userInputDay = moment.utc().startOf('day').subtract(6, 'days')
  predictor.userInputDispatch({
    type: 'current-start-adjust',
    inputDay: userInputDay,
  })
  expect(predictor.predictDay(userInputDay).onPeriod).toBe(true)
})

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
