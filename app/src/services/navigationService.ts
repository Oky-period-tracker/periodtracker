import { NavigationContainerRef } from '@react-navigation/native'
import { GlobalParamList } from '../navigation/RootNavigator'

let navigationRef: NavigationContainerRef<GlobalParamList> | null = null
let loadingCallback: ((loading: boolean) => void) | null = null

export const setNavigationRef = (ref: NavigationContainerRef<GlobalParamList>) => {
  navigationRef = ref
  console.log('[Navigation] navigationRef set')
}

export const registerLoadingCallback = (callback: (loading: boolean) => void) => {
  loadingCallback = callback
  console.log('[Navigation] loadingCallback registered')
}

export const goBack = () => {
  console.log('[Navigation] goBack called, navigationRef available:', !!navigationRef)
  if (navigationRef && navigationRef.canGoBack()) {
    console.log('[Navigation] Going back...')
    navigationRef.goBack()
  } else {
    console.warn('[Navigation] Cannot go back - navigationRef:', !!navigationRef, 'canGoBack:', navigationRef?.canGoBack())
  }
}

export const resetToAuth = () => {
  console.log('[Navigation] Resetting to Auth screen')
  if (navigationRef) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'Auth' as const }],
    })
    // Hide loader after short delay to let reset complete
    setTimeout(() => {
      if (loadingCallback) {
        loadingCallback(false)
      }
    }, 300)
  } else {
    console.warn('⚠️ [Navigation] Cannot reset - navigationRef not available')
  }
}

export const navigateToAuth = () => {
  console.log('[Navigation] navigateToAuth called, navigationRef available:', !!navigationRef)
  if (navigationRef) {
    console.log('[Navigation] Navigating to Auth...')
    navigationRef.navigate('Auth' as any)
  } else {
    console.warn('⚠️ [Navigation] Cannot navigate - navigationRef is null')
  }
}

export const navigate = (name: string, params?: any) => {
  if (navigationRef) {
    navigationRef.navigate(name as any, params)
  }
}

export const getCurrentRoute = () => {
  return navigationRef?.getCurrentRoute()?.name
}


