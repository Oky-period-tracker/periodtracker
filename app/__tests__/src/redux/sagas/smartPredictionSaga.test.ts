import moment from 'moment'
import { runSaga, stdChannel } from 'redux-saga'
import { PredictionState } from '../../../../src/prediction/PredictionState'
import { cycleEntries } from '../../../../src/prediction/serverCache'

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
function fullState(basedOn?: string[]) {
  return PredictionState.fromData({
    startDate: moment('2026-10-18'),
    smaCycleLength: 26,
    history: [cycle('2026-09-16', 32), cycle('2026-08-17', 30)],
    serverRange: { mean: 26, lower: 25, upper: 27, useBaseline: false, samplesTrained: 4, basedOn },
  })
}

async function runRequest(savedPrediction?: object, predictionFullState = fullState()) {
  const dispatched: { type: string; payload?: any }[] = []
  const channel = stdChannel()
  runSaga(
    {
      channel,
      dispatch: (a: { type: string }) => dispatched.push(a),
      getState: () => ({ prediction: savedPrediction }),
    },
    smartPredictionbSaga,
  )
  channel.put({
    type: 'SMART_PREDICTION_REQUEST',
    payload: { predictionFullState, futurePredictionStatus: true },
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

  it('offline, keeps a saved answer that is still based on her cycles', async () => {
    mockGetPeriodCycles.mockRejectedValue(new Error('Network Error'))
    const history = fullState().history
    const { saved } = await runRequest(undefined, fullState(cycleEntries(history)))
    expect(saved.smartPrediction.smaCycleLength).toBe(26)
    expect(saved.smartPrediction.serverRange.mean).toBe(26)
  })

  it('records which cycles a fresh answer was based on', async () => {
    mockGetPeriodCycles.mockResolvedValue({
      predictedCycleLength: 29.6,
      predictedPeriodLength: undefined,
      serverRange: { mean: 29.6, lower: 27, upper: 32, useBaseline: false, samplesTrained: 5 },
    })
    const { saved } = await runRequest()
    expect(saved.smartPrediction.serverRange.basedOn).toEqual(['2026-09-16:32', '2026-08-17:30'])
  })

  it('keeps the flag for a cycle the engine started by itself', async () => {
    mockGetPeriodCycles.mockResolvedValue({ predictedCycleLength: 30 })
    const state = fullState()
    state.currentCycle.autoStarted = true
    const { saved } = await runRequest(undefined, state)
    expect(saved.currentCycle.autoStarted).toBe(true)
  })

  it('sends her latest cycle only when the last answer was not based on it', async () => {
    mockGetPeriodCycles.mockResolvedValue({ predictedCycleLength: 30 })
    await runRequest()
    expect(mockGetPeriodCycles.mock.calls.at(-1)[0].new_observation.observed_cycle_length).toBe(32)

    const history = fullState().history
    await runRequest(undefined, fullState(cycleEntries(history)))
    expect(mockGetPeriodCycles.mock.calls.at(-1)[0].new_observation).toBeUndefined()

    // She edited that cycle: the server must learn the new value
    await runRequest(undefined, fullState(['2026-09-16:31', '2026-08-17:30']))
    expect(mockGetPeriodCycles.mock.calls.at(-1)[0].new_observation.observed_cycle_length).toBe(32)
  })

  it('does not resend her latest cycle after an answer without display bounds', async () => {
    // The server currently deployed answers with a cycle length only, so there is no serverRange
    mockGetPeriodCycles.mockResolvedValue({ predictedCycleLength: 30 })
    const { saved } = await runRequest(undefined, fullState())
    expect(mockGetPeriodCycles.mock.calls.at(-1)[0].new_observation.observed_cycle_length).toBe(32)
    expect(saved.smartPrediction.serverRange).toBeUndefined()

    await runRequest(undefined, PredictionState.fromJSON(saved))
    expect(mockGetPeriodCycles.mock.calls.at(-1)[0].new_observation).toBeUndefined()
  })

  it('keeps what the server learned when a request fails', async () => {
    mockGetPeriodCycles.mockResolvedValueOnce({ predictedCycleLength: 30 })
    const { saved } = await runRequest(undefined, fullState())
    mockGetPeriodCycles.mockRejectedValueOnce(new Error('Network Error'))
    const { saved: afterFailure } = await runRequest(undefined, PredictionState.fromJSON(saved))
    expect(afterFailure.smartPrediction.learnedFrom).toBe('2026-09-16:32')
  })

  it('drops the answer when her cycles changed while waiting for it', async () => {
    mockGetPeriodCycles.mockResolvedValue({
      predictedCycleLength: 29.6,
      predictedPeriodLength: undefined,
    })
    const edited = fullState().toJSON()
    edited.currentCycle.startDate = '2026-10-16T00:00:00.000Z'
    const { types } = await runRequest(edited)
    expect(types).not.toContain('SET_PREDICTION_ENGINE_STATE')
  })

  it('saves the answer when the saved cycles are still the ones it asked about', async () => {
    mockGetPeriodCycles.mockResolvedValue({
      predictedCycleLength: 29.6,
      predictedPeriodLength: undefined,
    })
    const { saved } = await runRequest(fullState().toJSON())
    expect(saved.smartPrediction.smaCycleLength).toBe(30)
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
