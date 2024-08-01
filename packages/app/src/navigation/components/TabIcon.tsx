import React from "react";
import { StyleSheet } from "react-native";
import { ButtonProps, DisplayButton } from "../../components/Button";

export const TabIcon = ({
  focused,
  children,
  ...props
}: ButtonProps & {
  focused: boolean;
}) => {
  return (
    <DisplayButton
      status={focused ? "primary" : "basic"}
      style={styles.tabIcon}
      {...props}
    >
      {children}
    </DisplayButton>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 40,
    height: 40,
  },
});
