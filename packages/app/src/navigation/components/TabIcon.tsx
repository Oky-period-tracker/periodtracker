import { StyleSheet } from "react-native";
import { UntouchableButton } from "../../components/Button";

export const TabIcon = ({
  focused,
  children,
}: {
  children: React.ReactNode;
  focused: boolean;
}) => {
  return (
    <UntouchableButton
      status={focused ? "primary" : "basic"}
      style={styles.tabIcon}
    >
      {children}
    </UntouchableButton>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 40,
    height: 40,
  },
});
