import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import configureStore from 'redux-mock-store'

import _ from 'lodash'
import * as actions from '../../../src/redux/actions'
import { authReducer } from '../../../src/redux/reducers/authReducer'

const middleWares = []
const mockStore = configureStore(middleWares)

describe('appActions', () => {
  const initialState = {}
  const store = mockStore(initialState)

  it('Set Avatar action', () => {
    const action = actions.setAvatar('nur')
    // Dispatch the action
    store.dispatch(action)
    // Test if your store dispatched the expected actions
    const scopedActions = store.getActions()
    const expectedType = `SET_AVATAR`
    expect(scopedActions[0].type).toEqual(expectedType)
  })

  it('Set Theme action', () => {
    const action = actions.setTheme('hills')
    // Dispatch the action
    store.dispatch(action)
    // Test if your store dispatched the expected actions
    const scopedActions = store.getActions()
    const expectedPayLoad = { theme: 'hills' }
    expect(scopedActions[1].payload).toEqual(expectedPayLoad)
  })
})
