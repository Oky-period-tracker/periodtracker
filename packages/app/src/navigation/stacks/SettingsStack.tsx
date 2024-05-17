import * as React from "react";
import NavigationStack, { StackConfig } from "../NavigationStack";
import SettingsScreen from "../../screens/SettingsScreen";
import AccessScreen from "../../screens/AccessScreen";
import TermsScreen from "../../screens/TermsScreen";
import AboutScreen from "../../screens/AboutScreen";
import PrivacyScreen from "../../screens/PrivacyScreen";
import ContactUsScreen from "../../screens/ContactUsScreen";

const config: StackConfig = {
  initialRouteName: "Settings",
  screens: [
    {
      title: "Settings",
      name: "Settings",
      Component: SettingsScreen,
    },
    {
      title: "Access",
      name: "Access",
      Component: AccessScreen,
    },
    {
      title: "Terms & Conditions",
      name: "Terms",
      Component: TermsScreen,
    },
    {
      title: "About",
      name: "About",
      Component: AboutScreen,
    },
    {
      title: "Privacy",
      name: "Privacy",
      Component: PrivacyScreen,
    },
    {
      title: "Contact Us",
      name: "Contact",
      Component: ContactUsScreen,
    },
  ],
};

const SettingsStack = () => <NavigationStack config={config} />;

export default SettingsStack;
