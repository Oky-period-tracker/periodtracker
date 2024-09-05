import * as React from 'react'
import { NavigatorScreenParams } from '@react-navigation/native'
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import ProfileStack, { ProfileStackParamList } from './stacks/ProfileStack'
import HomeStack, { HomeStackParamList } from './stacks/HomeStack'
import EncyclopediaStack, { EncyclopediaStackParamList } from './stacks/EncyclopediaStack'
import SettingsStack, { SettingsStackParamList } from './stacks/SettingsStack'
import { TabIcon } from './components/TabIcon'
import { UserIcon } from '../components/icons/UserIcon'
import { IS_IOS } from '../services/device'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type MainStackParamList = {
  profile: NavigatorScreenParams<ProfileStackParamList>
  home: NavigatorScreenParams<HomeStackParamList>
  encyclopedia: NavigatorScreenParams<EncyclopediaStackParamList>
  settings: NavigatorScreenParams<SettingsStackParamList>
}

const options: BottomTabNavigationOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarItemStyle: {
    backgroundColor: '#F1F1F1',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#F5F5F5',
  },
}

const Tab = createBottomTabNavigator()

function MainNavigator() {
  const insets = useSafeAreaInsets()

  const screenOptions: BottomTabNavigationOptions = {
    tabBarStyle: {
      minHeight: 60,
      padding: IS_IOS ? 8 : 0,
      backgroundColor: '#F1F1F1',
      paddingBottom: insets.bottom,
    },
  }

  return (
    <Tab.Navigator initialRouteName={'home'} screenOptions={screenOptions}>
      <Tab.Screen
        name={'profile'}
        component={ProfileStack}
        options={{
          ...options,
          tabBarIcon: ({ focused, size }) => (
            <TabIcon focused={focused} accessibilityLabel={'profile'}>
              <UserIcon size={size} />
            </TabIcon>
          ),
        }}
      />
      <Tab.Screen
        name={'home'}
        component={HomeStack}
        options={{
          ...options,
          tabBarIcon: ({ focused, size }) => (
            <TabIcon focused={focused} accessibilityLabel={'home'}>
              <FontAwesome size={size} name={'calendar'} color={'#fff'} />
            </TabIcon>
          ),
        }}
      />
      <Tab.Screen
        name={'encyclopedia'}
        component={EncyclopediaStack}
        options={{
          ...options,
          tabBarIcon: ({ focused, size }) => (
            <TabIcon focused={focused} accessibilityLabel={'encyclopedia'}>
              <FontAwesome size={size} name={'book'} color={'#fff'} />
            </TabIcon>
          ),
        }}
      />
      <Tab.Screen
        name={'settings'}
        component={SettingsStack}
        options={{
          ...options,
          tabBarIcon: ({ focused, size }) => (
            <TabIcon focused={focused} accessibilityLabel={'settings'}>
              <FontAwesome size={size} name={'gear'} color={'#fff'} />
            </TabIcon>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator
