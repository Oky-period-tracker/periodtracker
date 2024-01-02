import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import configureStore from 'redux-mock-store'

import _ from 'lodash'
import { commonActions } from '../../../src/redux/actions'
import { authReducer } from '../../../src/redux/reducers/authReducer'

const middleWares = []
const mockStore = configureStore(middleWares)

describe('authReducer', () => {
  const initialState = {}
  const store = mockStore(initialState)
  const mockPayload = {
    id: uuidv4(),
    name: 'Unit_Test_account',
    dateOfBirth: moment.utc('01-01-2000', 'DD-MM-YYYY'),
    gender: 'Male',
    location: 'Urban',
    country: 'ZA',
    province: '',
    password: _.toLower('00AAaa').trim(),
    secretQuestion: 'favourite_teacher',
    secretAnswer: _.toLower('secret_answer').trim(),
  }

  it('returns the initial state', () => {
    // sanity check of overall auth reducer
    // @ts-ignore
    expect(authReducer(initialState, {})).toEqual(initialState)
  })

  it('Create account request actions', () => {
    const action = commonActions.createAccountRequest({ ...mockPayload, id: undefined })
    // Dispatch the action
    store.dispatch(action)
    // Test if your store dispatched the expected actions
    const scopedActions = store.getActions()
    const expectedType = `CREATE_ACCOUNT_REQUEST`
    expect(scopedActions[0].type).toEqual(expectedType)
  })
  it('Login As guest account', () => {
    const action = commonActions.loginSuccessAsGuestAccount(mockPayload)
    const newStore = authReducer(undefined, action)
    // Dispatch the action

    expect(newStore?.user?.name).toEqual(mockPayload.name)
    expect(newStore?.user?.isGuest).toEqual(true)
  })
  it('Login Out guest account', () => {
    const action = commonActions.logout()
    const newStore = authReducer(undefined, action)
    // Dispatch the action

    expect(newStore.user).toEqual(null)
  })
  it('Create account faiure', () => {
    const action = commonActions.createAccountFailure()
    const newStore = authReducer(undefined, action)
    // Dispatch the action

    expect(newStore.connectAccountAttempts).toBeGreaterThan(0)
  })
})
