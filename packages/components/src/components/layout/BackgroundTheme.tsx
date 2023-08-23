import React from 'react'
import styled from 'styled-components/native'
import { useTheme } from '../context/ThemeContext'
import { useTodayPrediction } from '../context/PredictionProvider'
import { assets } from '../../assets'
import { ThemeName } from '../../types'

function getBackgroundImage(theme: ThemeName, onPeriod: boolean) {
  const background = assets.backgrounds[theme]
  if (!background) {
    throw new Error(`Background not found background with theme "${theme}"`)
  }
  if (onPeriod) {
    return background.onPeriod
  }

  return background.default
}

export function BackgroundTheme({ theme = null, ...props }) {
  const { id } = useTheme()
  const { onPeriod } = useTodayPrediction()
  const backgroundImage = getBackgroundImage(theme || id, onPeriod)

  return <Background source={backgroundImage} {...props} />
}

const Background = styled.ImageBackground`
  width: 100%;
  height: 100%;
`
