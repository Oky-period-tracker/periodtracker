import moment from 'moment'
import { runSaga, stdChannel } from 'redux-saga'
import { PredictionState } from '../../../../src/prediction/PredictionState'

const mockGetPeriodCycles = jest.fn()
jest.mock('../../../../src/services/HttpClient', () => ({
  httpClient: { getPeriodCycles: (...args: unknown[]) => mockGetPeriodCycles(...args) },
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { smartPredictionbSaga } = require('../../../../src/redux/sagas/smartPredictionSaga')

const cycle = (start: string, cycleLength: number) => ({
  cycleStartDate: moment(start),
  cycleEndDate: moment(start).add(cycleLength - 1, 'days'),
  periodLength: 5,
  cycleLength,
})

// Last cycles of 30 and 32 days, with a server answer of 26 saved from before her edit
function fullState() {
  return PredictionState.fromData({
    startDate: moment('2026-10-18'),
    smaCycleLength: 26,
    history: [cycle('2026-09-16', 32), cycle('2026-08-17', 30)],
    serverRange: { mean: 26, lower: 25, upper: 27, useBaseline: false, samplesTrained: 4 },
  })
}

async function runRequest() {
  const dispatched: { type: string; payload?: any }[] = []
  const channel = stdChannel()
  runSaga(
    { channel, dispatch: (a: { type: string }) => dispatched.push(a), getState: () => ({}) },
    smartPredictionbSaga,
  )
  channel.put({
    type: 'SMART_PREDICTION_REQUEST',
    payload: { predictionFullState: fullState(), futurePredictionStatus: true },
  })
  await new Promise((resolve) => setImmediate(resolve))
  const saved = dispatched.find((a) => a.type === 'SET_PREDICTION_ENGINE_STATE')
  return { types: dispatched.map((a) => a.type), saved: saved?.payload.predictionState.toJSON() }
}

describe('smartPredictionSaga', () => {
  it('uses the server answer when there is one', async () => {
    mockGetPeriodCycles.mockResolvedValue({
      predictedCycleLength: 29.6,
      predictedPeriodLength: undefined,
    })
    const { saved } = await runRequest()
    expect(saved.smartPrediction.smaCycleLength).toBe(30)
  })

  it('falls back to the average of her last cycles when offline, dropping the old server range', async () => {
    mockGetPeriodCycles.mockRejectedValue(new Error('Network Error'))
    const { types, saved } = await runRequest()
    expect(types).toContain('SMART_PREDICTION_FAILURE')
    expect(saved.smartPrediction.smaCycleLength).toBe(31)
    expect(saved.currentCycle.cycleLength).toBe(31)
    expect(saved.smartPrediction.serverRange).toBeUndefined()
  })

  it('falls back the same way when the answer has no cycle length', async () => {
    mockGetPeriodCycles.mockResolvedValue({
      predictedCycleLength: undefined,
      predictedPeriodLength: undefined,
    })
    const { types, saved } = await runRequest()
    expect(types).toContain('SMART_PREDICTION_FAILURE')
    expect(saved.smartPrediction.smaCycleLength).toBe(31)
  })
})
