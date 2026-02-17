import 'react-native-get-random-values'
import * as React from 'react'
import RootNavigator from './src/navigation/RootNavigator'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Background } from './src/components/Background'
import { Provider } from 'react-redux'
import { getStore, getPersistor, storeInitPromiseExport } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { useOrientationLock } from './src/hooks/useOrientationLock'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { EncyclopediaProvider } from './src/screens/EncyclopediaScreen/EncyclopediaContext'
import { ResponsiveProvider } from './src/contexts/ResponsiveContext'
import { PredictionProvider } from './src/contexts/PredictionProvider'
import { AuthProvider } from './src/contexts/AuthContext'
import { LoadingProvider } from './src/contexts/LoadingProvider'
import { StatusBar, View } from 'react-native'
import { analytics } from './src/services/firebase'
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated'
import { SoundProvider } from './src/contexts/SoundProvider'

function App() {
  useOrientationLock()
  const [store, setStore] = React.useState<any>(null)
  const [persistor, setPersistor] = React.useState<any>(null)

  React.useEffect(() => {
    analytics?.().logAppOpen()
  }, [])

  React.useEffect(() => {
    storeInitPromiseExport.then(async () => {
      console.log('🔹 [App] Store initialized')
      const readyStore = await getStore()
      const readyPersistor = await getPersistor()
      console.log('🔹 [App] Store ready:', !!readyStore)
      console.log('🔹 [App] Persistor ready:', !!readyPersistor)
      setStore(readyStore)
      setPersistor(readyPersistor)
    }).catch(error => {
      console.error('❌ [App] Failed to initialize store:', error)
      // Fallback - try to continue anyway
      getStore().then(readyStore => {
        getPersistor().then(readyPersistor => {
          setStore(readyStore)
          setPersistor(readyPersistor)
        })
      })
    })
  }, [])

  if (!store || !persistor) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
          {/* Loading - wait for store and persistor */}
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <ReducedMotionConfig mode={ReduceMotion.Never} />
      <GestureHandlerRootView>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
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
            </AuthProvider>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

export default App
