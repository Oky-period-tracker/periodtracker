import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { SpinnerScreen } from '../components/SpinnerScreen'

export type LoadingContext = {
  loading: boolean
  setLoading: (value: boolean, message?: string, whileLoading?: () => void) => void
}

const defaultValue: LoadingContext = {
  loading: false,
  setLoading: () => {},
}

const LoadingContext = React.createContext<LoadingContext>(defaultValue)

export const LoadingProvider = ({ children }: React.PropsWithChildren) => {
  const [loading, setLoadingState] = React.useState(false)
  const [text, setText] = React.useState<string>()

  const setLoading = (value: boolean, message?: string, whileLoading?: () => void) => {
    setText(message)
    setLoadingState(value)

    setTimeout(() => {
      whileLoading?.()
    }, 256)
  }

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
      <View>
        <Modal
          visible={loading}
          animationType={'fade'}
          transparent={true}
          statusBarTranslucent={true}
          supportedOrientations={['portrait', 'landscape']}
        >
          <View style={styles.backDrop} />
          <SpinnerScreen text={text} />
        </Modal>
      </View>
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  return React.useContext(LoadingContext)
}

export const useStopLoadingEffect = (duration = 1500) => {
  const { loading, setLoading } = useLoading()
  React.useEffect(() => {
    if (!loading) {
      return
    }

    const timeout = setTimeout(() => {
      setLoading(false)
    }, duration)

    return () => {
      clearTimeout(timeout)
    }
  })
}

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
})
