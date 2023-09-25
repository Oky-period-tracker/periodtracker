import React from 'react'
import { Dimensions } from 'react-native'

export const useScreenDimensions = () => {
  const initialWidth = Dimensions.get('screen').width
  const initialHeight = Dimensions.get('screen').height

  const [screenWidth, setWidth] = React.useState(initialWidth)
  const [screenHeight, setHeight] = React.useState(initialHeight)

  const handleDimensionsChange = ({ window: { width, height } }) => {
    setWidth(width)
    setHeight(height)
  }

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', handleDimensionsChange)

    return () => {
      subscription && subscription.remove()
    }
  }, [])

  return { screenWidth, screenHeight }
}
