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
  const height = UIConfig.misc.touchableRowHeight

  return (
    <TouchableOpacity
      style={[styles.row, { height, padding }]}
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
    height: 100,
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
