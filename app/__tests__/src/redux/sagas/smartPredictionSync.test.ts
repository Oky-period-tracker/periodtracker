import moment from 'moment'
import { AppState } from 'react-native'
import { runSaga, stdChannel } from 'redux-saga'
import { REHYDRATE } from 'redux-persist'
import { PredictionState } from '../../../../src/prediction/PredictionState'

const mockGetPeriodCycles = jest.fn()
jest.mock('../../../../src/services/HttpClient', () => ({
  httpClient: { getPeriodCycles: (...args: unknown[]) => mockGetPeriodCycles(...args) },
}))
jest.mock('../../../../src/config/env', () => ({
  ...jest.requireActual('../../../../src/config/env'),
  PREDICTION_ENGINE_VERSION: 'v2',
}))
const mockConnected = jest.fn()
jest.mock('../../../../src/services/network', () => ({
  fetchNetworkConnectionStatus: () => mockConnected(),
}))
let mockNetListener: (s: { isConnected: boolean }) => void
const mockNetUnsubscribe = jest.fn()
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: (listener: typeof mockNetListener) => {
    mockNetListener = listener
    return mockNetUnsubscribe
  },
}))
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { smartPredictionbSaga, SYNC_PAUSE_MS } = require('../../../../src/redux/sagas/smartPredictionSaga')

let appStateListener: (s: string) => void
const appStateRemove = jest.fn()

const cycle = (start: string, cycleLength: number) => ({
  cycleStartDate: moment(start),
  cycleEndDate: moment(start).add(cycleLength - 1, 'days'),
  periodLength: 5,
  cycleLength,
})
const saved = PredictionState.fromData({
  startDate: moment('2026-10-18'),
  cycleLength: 30,
  smaCycleLength: 30,
  history: [cycle('2026-09-16', 32), cycle('2026-08-17', 30)],
}).toJSON()

function start() {
  const channel = stdChannel()
  const task = runSaga(
    {
      channel,
      dispatch: (a: { type: string }) => channel.put(a),
      getState: () => ({
        prediction: saved,
        auth: { user: { id: 'u1', dateOfBirth: moment().subtract(15, 'years').toISOString() } },
      }),
    },
    smartPredictionbSaga,
  )
  return { channel, task }
}

// Lets the saga run, then lets the pause after her last tap pass
const afterPause = () => jest.advanceTimersByTimeAsync(SYNC_PAUSE_MS)

describe('smartPredictionSaga sync (v2)', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockGetPeriodCycles.mockReset().mockResolvedValue({ predictedCycleLength: 31 })
    mockConnected.mockReset().mockResolvedValue(true)
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, listener) => {
      appStateListener = listener as typeof appStateListener
      return { remove: appStateRemove }
    })
  })
  afterEach(() => jest.useRealTimers())

  it('waits for her to stop tapping, then asks the server once with the last state', async () => {
    const { channel } = start()
    const request = (cycleLength: number) => ({
      type: 'SMART_PREDICTION_REQUEST',
      payload: {
        cycle_lengths: [cycleLength],
        predictionFullState: PredictionState.fromJSON(saved),
      },
    })
    channel.put(request(28))
    await jest.advanceTimersByTimeAsync(SYNC_PAUSE_MS - 1)
    channel.put(request(29))
    await jest.advanceTimersByTimeAsync(SYNC_PAUSE_MS - 1)
    expect(mockGetPeriodCycles).not.toHaveBeenCalled()
    await jest.advanceTimersByTimeAsync(1)
    expect(mockGetPeriodCycles).toHaveBeenCalledTimes(1)
    expect(mockGetPeriodCycles.mock.calls[0][0].cycle_lengths).toEqual([29])
  })

  it('on app open, sends what is saved on the phone', async () => {
    const { channel } = start()
    channel.put({ type: REHYDRATE })
    await afterPause()
    expect(mockGetPeriodCycles).toHaveBeenCalledTimes(1)
    const sent = mockGetPeriodCycles.mock.calls[0][0]
    expect(sent.user_id).toBe('u1')
    expect(sent.age).toBe(15)
    expect(sent.cycle_lengths).toEqual([0, 0, 0, 0, 0, 0, 0, 30, 32, 30])
    expect(sent.new_observation.observed_cycle_length).toBe(32)
  })

  it('on app open, keeps the answer when her saved cycles were stored in another field order', async () => {
    const reordered = {
      ...saved,
      history: saved.history.map(({ cycleLength, periodLength, ...rest }: any) => ({
        ...rest,
        cycleLength,
        periodLength,
      })),
    }
    const channel = stdChannel()
    const dispatched: string[] = []
    runSaga(
      {
        channel,
        dispatch: (a: { type: string }) => {
          dispatched.push(a.type)
          channel.put(a)
        },
        getState: () => ({
          prediction: reordered,
          auth: { user: { id: 'u1', dateOfBirth: moment().subtract(15, 'years').toISOString() } },
        }),
      },
      smartPredictionbSaga,
    )
    channel.put({ type: REHYDRATE })
    await afterPause()
    expect(mockGetPeriodCycles).toHaveBeenCalledTimes(1)
    expect(dispatched).toContain('SET_PREDICTION_ENGINE_STATE')
  })

  it('on app open without a connection, does not try', async () => {
    mockConnected.mockResolvedValue(false)
    const { channel } = start()
    channel.put({ type: REHYDRATE })
    await afterPause()
    expect(mockGetPeriodCycles).not.toHaveBeenCalled()
  })

  it('when she comes back to the app, asks again', async () => {
    start()
    appStateListener('background')
    await afterPause()
    expect(mockGetPeriodCycles).not.toHaveBeenCalled()
    appStateListener('active')
    await afterPause()
    expect(mockGetPeriodCycles).toHaveBeenCalledTimes(1)
  })

  it('retries a failed request when she is back online, and only then', async () => {
    const { channel } = start()
    mockNetListener({ isConnected: true })
    await afterPause()
    expect(mockGetPeriodCycles).not.toHaveBeenCalled()

    mockGetPeriodCycles.mockRejectedValueOnce(new Error('Network Error'))
    channel.put({ type: REHYDRATE })
    await afterPause()
    expect(mockGetPeriodCycles).toHaveBeenCalledTimes(1)

    mockNetListener({ isConnected: false })
    await afterPause()
    mockNetListener({ isConnected: true })
    await afterPause()
    expect(mockGetPeriodCycles).toHaveBeenCalledTimes(2)

    // That retry worked: coming back online again does not resend
    mockNetListener({ isConnected: true })
    await afterPause()
    expect(mockGetPeriodCycles).toHaveBeenCalledTimes(2)
  })

  it('stops listening when the account is closed', async () => {
    const { task } = start()
    task.cancel()
    await afterPause()
    expect(appStateRemove).toHaveBeenCalled()
    expect(mockNetUnsubscribe).toHaveBeenCalled()
  })
})
