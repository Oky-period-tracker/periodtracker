import axios from 'axios'
import { createHttpClient } from '../../../src/services/HttpClient'

jest.mock('axios')

describe('getPeriodCycles (v2)', () => {
  it('reads the prediction when axios returns the body as an unparsed string', async () => {
    const body = { prediction: { predicted_cycle_length: 28, display_lower_bound: 25, display_upper_bound: 31, should_use_baseline: true, n_samples_trained: 5 } }
    ;(axios.post as jest.Mock).mockResolvedValue({ data: JSON.stringify(body) })
    const client = createHttpClient('', '', { predictionEndpoint: 'http://x', predictionEngineVersion: 'v2' })
    const result = await client.getPeriodCycles({ user_id: 'u' } as never)
    expect(result.predictedCycleLength).toBe(28)
    expect(result.serverRange).toEqual({ mean: 28, lower: 25, upper: 31, useBaseline: true, samplesTrained: 5 })
  })

  it('sends only her real cycles, without the zeros the v1 engine needs', async () => {
    ;(axios.post as jest.Mock).mockResolvedValue({ data: { prediction: { predicted_cycle_length: 30 } } })
    const client = createHttpClient('', '', { predictionEndpoint: 'http://x', predictionEngineVersion: 'v2' })
    await client.getPeriodCycles({
      user_id: 'u',
      age: 15,
      cycle_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 29, 31],
      period_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 5, 4],
    })
    const sent = (axios.post as jest.Mock).mock.calls.at(-1)[1]
    expect(sent.cycle_history).toEqual([29, 31])
    expect(sent.period_history).toEqual([5, 4])
  })
})
