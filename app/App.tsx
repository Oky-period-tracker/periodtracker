import 'react-native-get-random-values'
import * as React from 'react'
import RootNavigator from './src/navigation/RootNavigator'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Background } from './src/components/Background'
import { Provider } from 'react-redux'
import { StoreManagerProvider } from './src/redux/StoreManagerContext'
import { PersistGate } from 'redux-persist/integration/react'
import { useOrientationLock } from './src/hooks/useOrientationLock'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { EncyclopediaProvider } from './src/screens/EncyclopediaScreen/EncyclopediaContext'
import { ResponsiveProvider } from './src/contexts/ResponsiveContext'
import { PredictionProvider } from './src/contexts/PredictionProvider'
import { AuthProvider } from './src/contexts/AuthContext'
import { LoadingProvider } from './src/contexts/LoadingProvider'
import { StatusBar } from 'react-native'
import { analytics } from './src/services/firebase'
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated'
import { SoundProvider } from './src/contexts/SoundProvider'

function App() {
  useOrientationLock()

  React.useEffect(() => {
    analytics?.().logAppOpen()
  }, [])

  return (
    <SafeAreaProvider>
      <ReducedMotionConfig mode={ReduceMotion.Never} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StoreManagerProvider>
          {(bundle) => (
            <AuthProvider>
              <Provider store={bundle.store}>
                <PersistGate key={bundle.userId} loading={null} persistor={bundle.persistor}>
                  <PredictionProvider>
                    <ResponsiveProvider>
                      <SoundProvider>
                        <EncyclopediaProvider>
                          <Background>
                            <LoadingProvider>
                              <StatusBar hidden />
                              <RootNavigator />
                            </LoadingProvider>
                          </Background>
                        </EncyclopediaProvider>
                      </SoundProvider>
                    </ResponsiveProvider>
                  </PredictionProvider>
                </PersistGate>
              </Provider>
            </AuthProvider>
          )}
        </StoreManagerProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

export default App
