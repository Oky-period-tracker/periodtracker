import React from 'react'
import { StyleSheet } from 'react-native'
import { ButtonProps, DisplayButton } from '../../components/Button'
import { useAccessibilityLabel } from '../../hooks/useAccessibilityLabel'

export const TabIcon = ({
  focused,
  children,
  accessibilityLabel,
  ...props
}: ButtonProps & {
  focused: boolean
}) => {
  const getAccessibilityLabel = useAccessibilityLabel()
  const label = getAccessibilityLabel(accessibilityLabel || '')

  return (
    <DisplayButton
      status={focused ? 'primary' : 'basic'}
      style={styles.tabIcon}
      accessibilityLabel={label}
      {...props}
    >
      {children}
    </DisplayButton>
  )
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 40,
    height: 40,
  },
})
