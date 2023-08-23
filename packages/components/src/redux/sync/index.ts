import _ from 'lodash'
import { Action, Reducer, ReducersMapObject } from 'redux'

function syncReducerFactory(
  innerReducer: Reducer,
  reducerName: string,
): Reducer {
  return (state, action) => {
    if (action.type === 'REFRESH_STORE' && action.payload[reducerName]) {
      return {
        ...state,
        ...action.payload[reducerName],
      }
    }

    return innerReducer(state, action)
  }
}

export function syncReducers<S, A extends Action>(
  reducers: ReducersMapObject<S, A>,
  reducerNames: string[],
) {
  const reducerKeys = Object.keys(reducers)
  const reducersWrappers = reducerNames.reduce((prev, reducerName) => {
    if (!reducerKeys.includes(reducerName)) {
      return prev
    }

    const reducer = reducers[reducerName]
    return {
      ...prev,
      [reducerName]: syncReducerFactory(reducer, reducerName),
    }
  }, {})

  return {
    ...reducers,
    ...reducersWrappers,
  }
}

export function extractReducerState(state, reducerNames: string[]) {
  return _.pick(state, ...reducerNames)
}
