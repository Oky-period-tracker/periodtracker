import { NavigationActions, StackActions } from 'react-navigation'

let navigator
// Called on Root Screen
export const setTopLevelNavigator = navigatorRef => {
  navigator = navigatorRef
}
// Call to navigate to a specific Route
export const navigate = (routeName, params) => {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  )
}
// Call to navigate and reset so that the person cant go back
export const navigateAndReset = (routeName, params) => {
  navigator.dispatch(
    StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    }),
  )
}

// Call to replace screen on stack
export const replace = (routeName, params = undefined) => {
  navigator.dispatch(
    StackActions.replace({
      routeName,
      params,
    }),
  )
}

// Call to go back one screen on stack
export const BackOneScreen = () => {
  navigator.dispatch(NavigationActions.back())
}
