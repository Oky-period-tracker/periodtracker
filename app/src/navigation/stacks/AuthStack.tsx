import * as React from 'react'

import AuthScreen from '../../screens/AuthScreen'

import InfoScreen from '../../screens/InfoScreen'
import NavigationStack, { StackConfig } from '../components/NavigationStack'
import EncyclopediaScreen from '../../screens/EncyclopediaScreen'
import ArticlesScreen from '../../screens/ArticlesScreen'
import FindHelpScreen from '../../screens/FindHelpScreen'
import TermsScreen from '../../screens/TermsScreen'
import AboutScreen from '../../screens/AboutScreen'
import PrivacyScreen from '../../screens/PrivacyScreen'

export type AuthStackParamList = {
  Auth: undefined
  Info: undefined
  Terms: undefined
  About: undefined
  Privacy: undefined
  Encyclopedia: undefined
  Articles: {
    subcategoryId: string
  }
  Help: undefined
}

const config: StackConfig<keyof AuthStackParamList> = {
  initialRouteName: 'Auth',
  screens: {
    Auth: {
      title: '',
      component: AuthScreen,
    },
    Info: {
      title: 'info',
      component: InfoScreen,
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
    Encyclopedia: {
      title: 'encyclopedia',
      component: EncyclopediaScreen,
    },
    Articles: {
      title: '',
      component: ArticlesScreen,
    },
    Help: {
      title: 'find help',
      component: FindHelpScreen,
    },
  },
}

const AuthStack = () => <NavigationStack config={config} />

export default AuthStack
