import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { assets } from '../../../resources/assets'
import { Text } from '../../../components/Text'
import { palette } from '../../../config/theme'

export const AuthScreenHeader = () => {
  return (
    <View style={styles.container}>
      <Image source={assets.static.launch_icon} style={styles.logo} resizeMode={'contain'} />
      <View style={styles.textColumn}>
        <Text style={styles.title}>auth_welcome</Text>
        <Text style={styles.subtitle}>auth_catchphrase</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 48,
    flexDirection: 'row',
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  textColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    color: palette['secondary'].base,
    fontWeight: 'bold',
    fontSize: 26,
  },
  subtitle: {
    color: palette['secondary'].base,
    fontWeight: 'bold',
    fontSize: 16,
  },
})
