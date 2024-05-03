import * as React from "react";
import NavigationStack, { StackConfig } from "../NavigationStack";
import EditProfileScreen from "../../screens/EditProfileScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import AvatarAndThemeScreen from "../../screens/AvatarAndThemeScreen";

const config: StackConfig = {
  initialRouteName: "ProfileScreen",
  screens: [
    {
      title: "Profile",
      name: "ProfileScreen",
      Component: ProfileScreen,
    },
    {
      title: "Edit Profile",
      name: "EditProfileScreen",
      Component: EditProfileScreen,
    },
    {
      title: "Avatars & Themes",
      name: "AvatarAndThemeScreen",
      Component: AvatarAndThemeScreen,
    },
  ],
};

const ProfileStack = () => <NavigationStack config={config} />;

export default ProfileStack;
