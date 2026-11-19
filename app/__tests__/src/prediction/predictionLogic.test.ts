import moment from 'moment'
import { isLateStart } from '../../../src/prediction/predictionLogic'

describe('isLateStart', () => {
  const currentCycle = {
    startDate: moment('2026-10-18'),
    periodLength: 5,
    cycleLength: 28,
    autoStarted: true,
  }

  it('is true for a period day after a start the engine made up', () => {
    expect(
      isLateStart({ inputDay: moment('2026-10-23'), currentCycle, startConfirmed: false }),
    ).toBe(true)
  })

  it('is false when she confirmed that start, on or before it, or for a real start', () => {
    expect(
      isLateStart({ inputDay: moment('2026-10-23'), currentCycle, startConfirmed: true }),
    ).toBe(false)
    expect(
      isLateStart({ inputDay: moment('2026-10-18'), currentCycle, startConfirmed: false }),
    ).toBe(false)
    expect(
      isLateStart({
        inputDay: moment('2026-10-23'),
        currentCycle: { ...currentCycle, autoStarted: false },
        startConfirmed: false,
      }),
    ).toBe(false)
  })
})
