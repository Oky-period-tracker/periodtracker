import * as React from 'react'
import NavigationStack, { StackConfig } from '../components/NavigationStack'
import MainScreen from '../../screens/MainScreen'
import DayScreen from '../../screens/DayScreen'
import CalendarScreen from '../../screens/CalendarScreen'
import moment from 'moment'
import { Tutorial } from '../../screens/MainScreen/TutorialContext'

export type HomeStackParamList = {
  Home: {
    tutorial: Tutorial
  }
  Calendar: undefined
  Day: {
    date: moment.Moment
  }
}

const config: StackConfig<keyof HomeStackParamList> = {
  initialRouteName: 'Home',
  screens: {
    Home: {
      title: '',
      component: MainScreen,
    },
    Day: {
      title: 'Day',
      component: DayScreen,
    },
    Calendar: {
      title: 'calendar',
      component: CalendarScreen,
    },
  },
}

const HomeStack = () => <NavigationStack config={config} />

export default HomeStack
