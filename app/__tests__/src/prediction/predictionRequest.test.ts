import { requestLengths } from '../../../src/prediction/predictionRequest'

const cycle = (cycleLength: number, periodLength = 5) => ({ cycleLength, periodLength })

describe('requestLengths', () => {
  it('sends her cycles oldest first, padded to ten with leading zeros', () => {
    expect(requestLengths(cycle(28, 4), [cycle(31, 6), cycle(29)])).toEqual({
      cycle_lengths: [0, 0, 0, 0, 0, 0, 0, 29, 31, 28],
      period_lengths: [0, 0, 0, 0, 0, 0, 0, 5, 6, 4],
    })
  })

  it('never cuts a longer history', () => {
    const history = Array.from({ length: 11 }, (_, i) => cycle(20 + i))
    const { cycle_lengths } = requestLengths(cycle(40), history)
    expect(cycle_lengths).toHaveLength(12)
    expect(cycle_lengths[0]).toBe(30)
    expect(cycle_lengths[11]).toBe(40)
  })
})
