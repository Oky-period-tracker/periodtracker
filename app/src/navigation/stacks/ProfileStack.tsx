import * as React from 'react'
import NavigationStack, { StackConfig } from '../components/NavigationStack'
import EditProfileScreen from '../../screens/EditProfileScreen'
import ProfileScreen from '../../screens/ProfileScreen'
import AvatarScreen from '../../screens/AvatarScreen'
import ThemeScreen from '../../screens/ThemeScreen'
import CustomAvatarScreen from '../../screens/CustomAvatarScreen'

export type ProfileStackParamList = {
  Profile: undefined
  EditProfile: undefined
  Avatar: undefined
  CustomAvatar: { openNameModal?: boolean } | undefined
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
      title: 'choose_avatar',
      component: AvatarScreen,
    },
    CustomAvatar: {
      title: 'customizer_title',
      component: CustomAvatarScreen,
    },
    Theme: {
      title: 'select_theme_title',
      component: ThemeScreen,
    },
  },
}

const ProfileStack = () => <NavigationStack config={config} />

export default ProfileStack
