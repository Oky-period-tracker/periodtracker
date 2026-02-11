import React from 'react'
import { Image, ImageBackground, StyleSheet, View } from 'react-native'
import { Text } from '../../../components/Text'
import { Button } from '../../../components/Button'

export const CustomHelpCard = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.helpCard}>
      <ImageBackground
        source={require('./triple-clouds.png')}
        resizeMethod="scale"
        resizeMode="contain"
        style={styles.background}
      >
        <Image
          source={require('./encyclopedia-avatars.png')}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.text} status={'danger'}>
          you_are_not_alone
        </Text>
        <Button onPress={onPress} status={'secondary'} style={styles.button}>
          find_help_center
        </Button>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  helpCard: {
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  background: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    textDecorationLine: 'underline',
    marginBottom: 12,
  },
  image: {
    width: '35%',
    height: 120,
  },
  button: {
    width: 200,
    height: 80,
  },
})
