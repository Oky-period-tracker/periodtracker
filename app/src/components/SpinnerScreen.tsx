import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

import { assets } from '../resources/assets'
import { Text } from './Text'
import { useColor } from '../hooks/useColor'
import { Spinner } from './Spinner'

export const SpinnerScreen = ({ text }: { text?: string }) => {
  const { palette } = useColor()

  return (
    <View style={styles.screen}>
      {text && <Text style={[styles.text, { color: palette.secondary.text }]}>{text}</Text>}
      <View style={styles.container}>
        <View style={styles.inner}>
          <Image resizeMode="contain" source={assets.static.spin_load_face} style={styles.image} />
        </View>

        <Spinner>
          <Image
            resizeMode="contain"
            source={assets.static.spin_load_circle}
            style={styles.image}
          />
        </Spinner>
      </View>
    </View>
  )
}

const size = 120

const styles = StyleSheet.create({
  image: {
    width: size,
    height: size,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: size,
    height: size,
  },
  inner: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
