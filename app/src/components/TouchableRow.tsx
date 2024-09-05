import * as React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from './Text'

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
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={disabled}>
      <View style={styles.rowLeft}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text>{description}</Text>}
      </View>
      {component && <View style={styles.rowRight}>{component}</View>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    overflow: 'hidden',
  },
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
