import * as React from 'react'
import NavigationStack, { StackConfig } from '../components/NavigationStack'
import EditProfileScreen from '../../screens/EditProfileScreen'
import ProfileScreen from '../../screens/ProfileScreen'
import SelectAvatarScreen from '../../screens/SelectAvatarScreen'
import SelectThemeScreen from '../../screens/SelectThemeScreen'

export type ProfileStackParamList = {
  Profile: undefined
  EditProfile: undefined
  SelectAvatar: undefined
  SelectTheme: undefined
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
    SelectAvatar: {
      title: 'select_avatar',
      component: SelectAvatarScreen,
    },
    SelectTheme: {
      title: 'select_theme',
      component: SelectThemeScreen,
    },
  },
}

const ProfileStack = () => <NavigationStack config={config} />

export default ProfileStack
