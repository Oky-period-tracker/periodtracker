import * as React from 'react'
import NavigationStack, { StackConfig } from '../components/NavigationStack'
import EditProfileScreen from '../../screens/EditProfileScreen'
import ProfileScreen from '../../screens/ProfileScreen'
import AvatarScreen from '../../screens/AvatarScreen'
import ThemeScreen from '../../screens/ThemeScreen'

export type ProfileStackParamList = {
  Profile: undefined
  EditProfile: undefined
  Avatar: undefined
  Theme: undefined
}

const config: StackConfig<keyof ProfileStackParamList> = {
  initialRouteName: 'Profile',
  screens: {
    Profile: {
      title: 'profile',
      component: ProfileScreen,
    },
    EditProfile: {
      title: 'profile_edit',
      component: EditProfileScreen,
    },
    Avatar: {
      title: 'select_avatar',
      component: AvatarScreen,
    },
    Theme: {
      title: 'select_theme',
      component: ThemeScreen,
    },
  },
}

const ProfileStack = () => <NavigationStack config={config} />

export default ProfileStack
