import * as React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from './Text'
import { useResponsive } from '../contexts/ResponsiveContext'

export interface TouchableRowProps {
  title: string
  description: string
  onPress?: () => void
  component?: React.ReactNode
  disabled?: boolean
}

export const TouchableRow = ({
  title,
  description,
  onPress,
  component,
  disabled,
}: TouchableRowProps) => {
  const { UIConfig } = useResponsive()
  const padding = UIConfig.misc.touchableRowPadding
  // A minimum, not a fixed height: longer translations wrap and the row grows to fit them
  const minHeight = UIConfig.misc.touchableRowHeight

  return (
    <TouchableOpacity
      style={[styles.row, { minHeight, padding }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text>{description}</Text>}
      </View>
      {component && <View style={styles.rowRight}>{component}</View>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    minHeight: 100,
    width: '100%',
    flexDirection: 'row',
    padding: 24,
  },
  rowLeft: {
    justifyContent: 'center',
    flex: 1,
    padding: 8,
  },
  rowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
})
