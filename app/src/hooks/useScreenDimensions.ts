import React from 'react'
import { Dimensions, ScaledSize } from 'react-native'

export const useScreenDimensions = () => {
  const [dimensions, setDimensions] = React.useState(Dimensions.get('screen'))

  const handleDimensionsChange = ({ screen }: { screen: ScaledSize }) => {
    setDimensions(screen)
  }

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', handleDimensionsChange)

    return () => {
      subscription && subscription.remove()
    }
  }, [])

  return dimensions
}
