import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export const KeyboardAwareAvoidance = ({ style = null, contentContainerStyle = {}, children }) => {
  return (
    <KeyboardAwareScrollView
      style={{ flexGrow: null, flexShrink: 1, overflow: 'visible' }}
      contentContainerStyle={[{ overflow: 'visible' }, contentContainerStyle]}
      extraScrollHeight={-75}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      viewIsInsideTabBar={false}
      enableOnAndroid={true}
    >
      {children}
    </KeyboardAwareScrollView>
  )
}
