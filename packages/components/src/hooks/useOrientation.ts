import React from 'react'
import { Dimensions } from 'react-native'

type Orientation = 'portrait' | 'landscape'

/**
 * Detects the orientation of the device, causes re-render on orientation change
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = React.useState<Orientation>(getOrientation())

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      const currentOrientation = width < height ? 'portrait' : 'landscape'
      if (orientation !== currentOrientation) {
        setOrientation(currentOrientation)
      }
    })

    return () => subscription.remove()
  }, [])

  return orientation
}

function getOrientation(): Orientation {
  const { width, height } = Dimensions.get('window')
  return width < height ? 'portrait' : 'landscape'
}
