import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Screen } from '../../components/Screen'
import { TouchableRow, TouchableRowProps } from '../../components/TouchableRow'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Hr } from '../../components/Hr'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'

const InfoScreen: ScreenComponent<'Info'> = ({ navigation }) => {
  const { backgroundColor, borderColor } = useColor()

  const rows: TouchableRowProps[] = [
    {
      title: 'about',
      description: 'about_info',
      onPress: () => navigation.navigate('About'),
      component: <ArrowRight color={borderColor} />,
    },
    {
      title: 't_and_c',
      description: 't_and_c_info',
      onPress: () => navigation.navigate('Terms'),
      component: <ArrowRight color={borderColor} />,
    },
    {
      title: 'privacy_policy',
      description: 'privacy_info',
      onPress: () => navigation.navigate('Privacy'),
      component: <ArrowRight color={borderColor} />,
    },
    {
      title: 'encyclopedia',
      description: '',
      onPress: () => navigation.navigate('Encyclopedia'),
      component: <ArrowRight color={borderColor} />,
    },
  ]

  return (
    <Screen style={styles.screen}>
      <View style={[styles.container, globalStyles.shadow, { backgroundColor }]}>
        {rows.map((props, i) => {
          const isLast = i === rows.length - 1
          return (
            <React.Fragment key={`settings-${i}`}>
              <TouchableRow {...props} />
              {!isLast && <Hr />}
            </React.Fragment>
          )
        })}
      </View>
    </Screen>
  )
}

export default InfoScreen

const ArrowRight = ({ color }: { color: string }) => (
  <FontAwesome size={12} name={'arrow-right'} color={color} />
)

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 12,
  },
  container: {
    borderRadius: 20,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 600,
    marginTop: 12,
  },
  button: {},
  deleteButton: {
    marginHorizontal: 8,
  },
})
