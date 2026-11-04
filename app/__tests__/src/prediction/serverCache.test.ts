import moment from 'moment'
import { cachedAnswerUsable, cycleEntries } from '../../../src/prediction/serverCache'

const cycle = (start: string, cycleLength: number) => ({
  cycleStartDate: moment(start),
  cycleLength,
})
const answeredFor = [cycle('2026-09-01', 30), cycle('2026-08-02', 30)]
const range = {
  mean: 30,
  lower: 28,
  upper: 32,
  useBaseline: false,
  samplesTrained: 4,
  basedOn: cycleEntries(answeredFor),
}

describe('cachedAnswerUsable', () => {
  it('usable for the history it was based on', () => {
    expect(cachedAnswerUsable(range, answeredFor)).toBe(true)
  })

  it('still usable after one more completed cycle', () => {
    expect(cachedAnswerUsable(range, [cycle('2026-10-01', 30), ...answeredFor])).toBe(true)
  })

  it('stale after two completed cycles without a fresh answer', () => {
    expect(
      cachedAnswerUsable(range, [cycle('2026-10-31', 30), cycle('2026-10-01', 30), ...answeredFor]),
    ).toBe(false)
  })

  it('an edit to a cycle it was based on invalidates it', () => {
    expect(cachedAnswerUsable(range, [cycle('2026-09-01', 31), cycle('2026-08-02', 30)])).toBe(
      false,
    )
    expect(cachedAnswerUsable(range, [answeredFor[0]])).toBe(false)
  })

  it('an answer saved without what it was based on is not reused', () => {
    expect(cachedAnswerUsable({ ...range, basedOn: undefined }, answeredFor)).toBe(false)
  })
})
