import { localRange } from '../../../src/prediction/localRange'

describe('localRange (the phone calculates for itself)', () => {
  it('no cycles yet: the generic ± 3', () => {
    expect(localRange(28, [])).toEqual({ cycle: { mean: 28, lower: 25, upper: 31 } })
  })

  it('one cycle: still the generic spread', () => {
    expect(localRange(30, [30])).toEqual({ cycle: { mean: 30, lower: 27, upper: 33 } })
  })

  it('regular cycles narrow the range', () => {
    const r = localRange(29, [29, 29, 29, 29, 29, 29])
    // variance (6 * 0 + 3 * 9) / 9 = 3 -> sd 1.73
    expect(r.cycle!.upper - 29).toBeCloseTo(Math.sqrt(3))
  })

  it('three or more cycles that vary too much: the message instead of a range', () => {
    expect(localRange(30, [24, 36, 26, 38])).toEqual({ cycle: null, irregular: true })
  })

  it('fewer than three cycles that vary a lot: the generic range, capped at ± 3', () => {
    expect(localRange(30, [22, 38])).toEqual({ cycle: { mean: 30, lower: 27, upper: 33 } })
  })
})
