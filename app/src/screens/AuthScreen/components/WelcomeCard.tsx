import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { DisplayButton } from '../../../components/Button'
import { Text } from '../../../components/Text'
import { assets } from '../../../resources/assets'
import { useColor } from '../../../hooks/useColor'

interface WelcomeCardProps {
  icon: React.ReactNode
  subtitle: string
  description: string
}

export const WelcomeCard = ({ icon, subtitle, description }: WelcomeCardProps) => {
  const { palette, backgroundColor } = useColor()

  return (
    <View style={[styles.page, { backgroundColor }]}>
      <View style={styles.welcomeContainer}>
        <Image source={assets.static.launch_icon} style={styles.logo} resizeMode={'contain'} />
        <Text style={[styles.title, { color: palette.danger.text }]}>auth_welcome</Text>
      </View>

      <DisplayButton status={'primary'} style={styles.button}>
        {icon}
      </DisplayButton>

      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    maxWidth: 800,
    borderRadius: 20,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
    flex: 1,
  },
  button: {
    height: 80,
    width: 80,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
})
