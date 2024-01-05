import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LocaleProvider } from './context/LocaleContext'
import { DisplayTextProvider } from './context/DisplayTextContext'
import { PredictionProvider } from './context/PredictionProvider'
import { AlertContextProvider } from './context/AlertContext'
import { FlowerProvider } from '../optional/Flower'
import { StoreCoordinator } from '../redux/StoreCoordinator'

export const AppProvider = ({ children }) => (
  <StoreCoordinator>
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
  </StoreCoordinator>
)
