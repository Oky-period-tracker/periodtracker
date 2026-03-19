import * as React from 'react'
import NavigationStack, { StackConfig } from '../components/NavigationStack'
import EditProfileScreen from '../../screens/EditProfileScreen'
import ProfileScreen from '../../screens/ProfileScreen'
import AvatarAndThemeScreen from '../../screens/AvatarAndThemeScreen'
import ThemeSelectScreen from '../../screens/ThemeSelectScreen'
import AvatarSelectScreen from '../../screens/AvatarSelectScreen'

export type ProfileStackParamList = {
  Profile: undefined
  EditProfile: undefined
  AvatarAndTheme: undefined
  AvatarSelect: undefined
  ThemeSelect: undefined
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
    AvatarAndTheme: {
      title: 'avatar_amp_themes',
      component: AvatarAndThemeScreen,
    },
    AvatarSelect: {
      title: 'select_avatar_title',
      component: AvatarSelectScreen,
    },
    ThemeSelect: {
      title: 'select_theme_title',
      component: ThemeSelectScreen,
    }
  },
}

const ProfileStack = () => <NavigationStack config={config} />

export default ProfileStack
