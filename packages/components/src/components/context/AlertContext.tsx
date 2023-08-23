import React from 'react'
import { Animated, SafeAreaView } from 'react-native'
import styled from 'styled-components/native'
import { TextWithoutTranslation } from '../common/Text'

export const AlertContext = React.createContext(null)

export function AlertContextProvider({ children }) {
  // ---- sliding self dissolving alert message ----
  const [bounceValue] = React.useState(new Animated.Value(-160))
  const [isDissolveAlertVisible, setIsDissolveAlertVisible] = React.useState(false)
  const [dissolveAlertMessage, setDissolveAlertMessage] = React.useState('')
  const [dissolveAlertIsDismissed, setDissolveAlertIsDismissed] = React.useState(false)

  const showDissolveAlert = (message, isPermanentAlert = false, timing = 4000) => {
    setDissolveAlertIsDismissed(false)
    setDissolveAlertMessage(message)
    setIsDissolveAlertVisible(true)

    Animated.timing(bounceValue, {
      toValue: -50,
      duration: 500,
      useNativeDriver: true,
    }).start()
    if (!isPermanentAlert) {
      setTimeout(() => {
        if (!dissolveAlertIsDismissed) {
          hideDissolveAlert()
        }
      }, timing)
    }
  }

  const hideDissolveAlert = () => {
    Animated.timing(bounceValue, {
      toValue: -160,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setDissolveAlertMessage('')
      setIsDissolveAlertVisible(false)
    })
  }

  return (
    <AlertContext.Provider value={{ showDissolveAlert }}>
      {children}
      {isDissolveAlertVisible && (
        <DissolveAlertComponent {...{ dissolveAlertMessage, bounceValue }} />
      )}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const alertContext = React.useContext(AlertContext)
  if (alertContext === undefined) {
    throw new Error(`useAlert must be used within a AlertProvider`)
  }
  return alertContext
}

const DissolveAlertComponent = ({ dissolveAlertMessage, bounceValue }) => (
  <SafeAreaView style={{ position: 'absolute', top: 0, width: '100%' }}>
    <Animated.View style={[{ transform: [{ translateY: bounceValue }] }]}>
      <DissolvingPopUp>
        <TextWithoutTranslation>{dissolveAlertMessage}</TextWithoutTranslation>
      </DissolvingPopUp>
    </Animated.View>
  </SafeAreaView>
)

const DissolvingPopUp = styled.View`
  width: 100%;
  padding: 25px;
  padding-top: 60px;
  z-index: 100000;
  elevation: 5;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-width: 8;
  border-color: #e3629b;
  border-bottom-left-radius: 20;
  border-bottom-right-radius: 20;
`
