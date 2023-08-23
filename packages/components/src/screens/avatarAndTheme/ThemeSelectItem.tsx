import React from 'react'
import styled from 'styled-components/native'
import { useTheme } from '../../components/context/ThemeContext'
import { useTodayPrediction } from '../../components/context/PredictionProvider'
import { assets } from '../../assets/index'
import { ThemeName } from '../../types/index'
import FastImage from 'react-native-fast-image'

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

export function ThemeSelectItem({ theme = null, ...props }) {
  const { id } = useTheme()
  const { onPeriod } = useTodayPrediction()
  const backgroundImage = getBackgroundImage(theme || id, onPeriod)

  return <ImageFast source={backgroundImage} {...props} />
}

const ImageFast = styled(FastImage)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`
