import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { assets } from '../../../resources/assets'
import { Text } from '../../../components/Text'
import { useColor } from '../../../hooks/useColor'

export const AuthScreenHeader = () => {
  const { palette } = useColor()

  return (
    <View style={styles.container}>
      <Image source={assets.static.launch_icon} style={styles.logo} resizeMode={'contain'} />
      <View style={styles.textColumn}>
        <Text style={[styles.title, { color: palette.secondary.text }]}>auth_welcome</Text>
        <Text style={[styles.subtitle, { color: palette.secondary.text }]}>auth_catchphrase</Text>
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
    fontWeight: 'bold',
    fontSize: 26,
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
})
