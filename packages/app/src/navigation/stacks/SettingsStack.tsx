import * as React from "react";
import NavigationStack, { StackConfig } from "../components/NavigationStack";
import SettingsScreen from "../../screens/SettingsScreen";
import AccessScreen from "../../screens/AccessScreen";
import TermsScreen from "../../screens/TermsScreen";
import AboutScreen from "../../screens/AboutScreen";
import PrivacyScreen from "../../screens/PrivacyScreen";
import ContactUsScreen from "../../screens/ContactUsScreen";

export type SettingsStackParamList = {
  Settings: undefined;
  Access: undefined;
  Terms: undefined;
  About: undefined;
  Privacy: undefined;
  Contact: undefined;
};

const config: StackConfig<keyof SettingsStackParamList> = {
  initialRouteName: "Settings",
  screens: {
    Settings: {
      title: "Settings",
      component: SettingsScreen,
    },
    Access: {
      title: "Access",
      component: AccessScreen,
    },
    Terms: {
      title: "Terms & Conditions",
      component: TermsScreen,
    },
    About: {
      title: "About",
      component: AboutScreen,
    },
    Privacy: {
      title: "Privacy",
      component: PrivacyScreen,
    },
    Contact: {
      title: "Contact Us",
      component: ContactUsScreen,
    },
  },
};

const SettingsStack = () => <NavigationStack config={config} />;

export default SettingsStack;
