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
})
