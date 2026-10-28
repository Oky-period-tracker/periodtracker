import moment from 'moment'
import { runSaga, stdChannel } from 'redux-saga'
import { PredictionState } from '../../../../src/prediction/PredictionState'

const mockGetPeriodCycles = jest.fn()
jest.mock('../../../../src/services/HttpClient', () => ({
  httpClient: { getPeriodCycles: (...args: unknown[]) => mockGetPeriodCycles(...args) },
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { smartPredictionbSaga } = require('../../../../src/redux/sagas/smartPredictionSaga')

async function runRequest() {
  const dispatched: { type: string }[] = []
  const channel = stdChannel()
  runSaga(
    { channel, dispatch: (a: { type: string }) => dispatched.push(a), getState: () => ({}) },
    smartPredictionbSaga,
  )
  channel.put({
    type: 'SMART_PREDICTION_REQUEST',
    payload: {
      predictionFullState: PredictionState.fromData({ startDate: moment('2026-10-18') }),
      futurePredictionStatus: true,
    },
  })
  await new Promise((resolve) => setImmediate(resolve))
  return dispatched.map((a) => a.type)
}

describe('smartPredictionSaga', () => {
  it('does not save a state without a cycle length when the response has none', async () => {
    mockGetPeriodCycles.mockResolvedValue({ predictedCycleLength: undefined, predictedPeriodLength: undefined })
    expect(await runRequest()).toEqual(['SMART_PREDICTION_FAILURE'])
  })

  it('saves the state when the response has a cycle length', async () => {
    mockGetPeriodCycles.mockResolvedValue({ predictedCycleLength: 30, predictedPeriodLength: undefined })
    expect(await runRequest()).toContain('SET_PREDICTION_ENGINE_STATE')
  })
})
