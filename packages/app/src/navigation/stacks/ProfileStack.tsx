import * as React from "react";
import NavigationStack, { StackConfig } from "../NavigationStack";
import EditProfileScreen from "../../screens/EditProfileScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import AvatarAndThemeScreen from "../../screens/AvatarAndThemeScreen";

const config: StackConfig = {
  initialRouteName: "Profile",
  screens: [
    {
      title: "Profile",
      name: "Profile",
      Component: ProfileScreen,
    },
    {
      title: "Edit Profile",
      name: "EditProfile",
      Component: EditProfileScreen,
    },
    {
      title: "Avatars & Themes",
      name: "AvatarAndTheme",
      Component: AvatarAndThemeScreen,
    },
  ],
};

const ProfileStack = () => <NavigationStack config={config} />;

export default ProfileStack;
