import * as React from 'react'
import NavigationStack, { StackConfig } from '../components/NavigationStack'
import SettingsScreen from '../../screens/SettingsScreen'
import AccessScreen from '../../screens/AccessScreen'
import TermsScreen from '../../screens/TermsScreen'
import AboutScreen from '../../screens/AboutScreen'
import PrivacyScreen from '../../screens/PrivacyScreen'
import ContactUsScreen from '../../screens/ContactUsScreen'

export type SettingsStackParamList = {
  Settings: undefined
  Access: undefined
  Terms: undefined
  About: undefined
  Privacy: undefined
  Contact: undefined
}

const config: StackConfig<keyof SettingsStackParamList> = {
  initialRouteName: 'Settings',
  screens: {
    Settings: {
      title: 'settings',
      component: SettingsScreen,
    },
    Access: {
      title: 'access_setting',
      component: AccessScreen,
    },
    Terms: {
      title: 't_and_c',
      component: TermsScreen,
    },
    About: {
      title: 'about',
      component: AboutScreen,
    },
    Privacy: {
      title: 'privacy_policy',
      component: PrivacyScreen,
    },
    Contact: {
      title: 'contact_us',
      component: ContactUsScreen,
    },
  },
}

const SettingsStack = () => <NavigationStack config={config} />

export default SettingsStack
