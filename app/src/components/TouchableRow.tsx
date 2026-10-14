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
      style={[styles.row, { minHeight: height, padding: Math.max(padding - 6, 12) }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {component && <View style={styles.rowRight}>{component}</View>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowLeft: {
    justifyContent: 'center',
    flex: 1,
    paddingRight: 8,
  },
  rowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
  },
})
