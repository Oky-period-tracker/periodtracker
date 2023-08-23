import { REHYDRATE, RehydrateErrorType } from 'redux-persist'

declare module 'redux-persist' {
  // @see https://github.com/rt2zz/redux-persist/issues/931
  export interface RehydrateAction<Payload = any> {
    type: typeof REHYDRATE
    key: string
    payload?: Payload
    err?: RehydrateErrorType
  }
}
