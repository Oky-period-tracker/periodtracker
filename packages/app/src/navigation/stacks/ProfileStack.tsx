import * as React from "react";
import NavigationStack, { StackConfig } from "../NavigationStack";
import EditProfileScreen from "../../screens/EditProfileScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import AvatarAndThemeScreen from "../../screens/AvatarAndThemeScreen";

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  AvatarAndTheme: undefined;
};

const config: StackConfig<ProfileStackParamList> = {
  initialRouteName: "Profile",
  screens: {
    Profile: {
      title: "Profile",
      component: ProfileScreen,
    },
    EditProfile: {
      title: "Edit Profile",
      component: EditProfileScreen,
    },
    AvatarAndTheme: {
      title: "Avatars & Themes",
      component: AvatarAndThemeScreen,
    },
  },
};

const ProfileStack = () => <NavigationStack config={config} />;

export default ProfileStack;
