import { StyleSheet } from "react-native";
import { DisplayButton } from "../../components/Button";

export const TabIcon = ({
  focused,
  children,
}: {
  children: React.ReactNode;
  focused: boolean;
}) => {
  return (
    <DisplayButton
      status={focused ? "primary" : "basic"}
      style={styles.tabIcon}
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
