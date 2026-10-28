import { PredictionState } from '../../../src/prediction/PredictionState'

describe('PredictionState', () => {
  it('keeps the six-cycle buffers across a save and restore (app restart)', () => {
    const state = PredictionState.fromData({})
    ;[27, 29, 31].forEach((v) => state.smartPrediction.circularCycleLength.push(v))
    ;[4, 5, 6].forEach((v) => state.smartPrediction.circularPeriodLength.push(v))

    const restored = PredictionState.fromJSON(JSON.parse(JSON.stringify(state.toJSON())))

    expect(restored.smartPrediction.circularCycleLength.toarray()).toEqual([27, 29, 31])
    expect(restored.smartPrediction.circularPeriodLength.toarray()).toEqual([4, 5, 6])
  })

  it('restores a usable cycle length when the saved one is null (NaN persisted)', () => {
    const json = PredictionState.fromData({}).toJSON()
    const corrupted = JSON.parse(
      JSON.stringify({
        ...json,
        currentCycle: { ...json.currentCycle, cycleLength: NaN },
        smartPrediction: { ...json.smartPrediction, smaCycleLength: NaN, smaPeriodLength: NaN },
      }),
    )
    const restored = PredictionState.fromJSON(corrupted)
    expect(restored.currentCycle.cycleLength).toBe(28)
    expect(restored.smartPrediction.smaCycleLength).toBe(28)
    expect(restored.smartPrediction.smaPeriodLength).toBe(5)
  })
})
