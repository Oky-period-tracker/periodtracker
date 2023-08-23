import React from 'react'
import { ThemeContext, ThemeProvider as StyledThemeProvider } from 'styled-components'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'
import { themes } from '../../themes'

export function ThemeProvider({ children }) {
  const themeName = useSelector(state => state.app.theme)
  const locale = useSelector(selectors.currentLocaleSelector)
  return (
    <StyledThemeProvider
      theme={{ ...themes[themeName], fontSize: moderateScale(themes[themeName].fontSize, locale) }}
    >
      {children}
    </StyledThemeProvider>
  )
}

export function useTheme() {
  const themeContext = React.useContext(ThemeContext)
  if (themeContext === undefined) {
    throw new Error(`useTheme must be used within a ThemeProvider`)
  }

  return themeContext
}

export const moderateScale = (fontSize, locale) => {
  // why have this? Because everything said in 1 word in english takes 4 words at triple the length in mongolian so lets reduce the size for neatening up
  if (locale === 'mn') {
    return fontSize * 0.8
  }
  return fontSize
}
