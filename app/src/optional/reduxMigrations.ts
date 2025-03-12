import { PersistMigrate } from 'redux-persist'

/* eslint-disable @typescript-eslint/no-var-requires */
let reduxMigrations: { [key: number]: PersistMigrate } = {}
let reduxStoreVersion = -1

try {
  reduxMigrations = require('../resources/reduxMigrations').reduxMigrations
  reduxStoreVersion = require('../resources/reduxMigrations').reduxStoreVersion
} catch (e) {
  //
}

export { reduxMigrations, reduxStoreVersion }
