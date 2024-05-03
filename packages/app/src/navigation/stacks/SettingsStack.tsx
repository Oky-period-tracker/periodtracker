import * as React from "react";
import NavigationStack, { StackConfig } from "../NavigationStack";
import SettingsScreen from "../../screens/SettingsScreen";
import AccessScreen from "../../screens/AccessScreen";
import TermsScreen from "../../screens/TermsScreen";
import AboutScreen from "../../screens/AboutScreen";
import PrivacyScreen from "../../screens/PrivacyScreen";
import ContactUsScreen from "../../screens/ContactUsScreen";

const config: StackConfig = {
  initialRouteName: "EncyclopediaScreen",
  screens: [
    {
      title: "Settings",
      name: "SettingsScreen",
      Component: SettingsScreen,
    },
    {
      title: "Access",
      name: "AccessScreen",
      Component: AccessScreen,
    },
    {
      title: "Terms & Conditions",
      name: "TermsScreen",
      Component: TermsScreen,
    },
    {
      title: "About",
      name: "AboutScreen",
      Component: AboutScreen,
    },
    {
      title: "Privacy",
      name: "PrivacyScreen",
      Component: PrivacyScreen,
    },
    {
      title: "Contact Us",
      name: "ContactUsScreen",
      Component: ContactUsScreen,
    },
  ],
};

const SettingsStack = () => <NavigationStack config={config} />;

export default SettingsStack;
