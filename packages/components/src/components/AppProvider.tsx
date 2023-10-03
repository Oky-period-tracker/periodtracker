import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from './context/ThemeContext'
import { LocaleProvider } from './context/LocaleContext'
import { DisplayTextProvider } from './context/DisplayTextContext'
import { PredictionProvider } from './context/PredictionProvider'
import { AlertContextProvider } from './context/AlertContext'
import { FlowerProvider } from '../moduleImports'

export const AppProvider = ({ children, store, persistor }) => (
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <LocaleProvider>
        <ThemeProvider>
          <PredictionProvider>
            <FlowerProvider>
              <AlertContextProvider>
                <DisplayTextProvider>{children}</DisplayTextProvider>
              </AlertContextProvider>
            </FlowerProvider>
          </PredictionProvider>
        </ThemeProvider>
      </LocaleProvider>
    </PersistGate>
  </ReduxProvider>
)
