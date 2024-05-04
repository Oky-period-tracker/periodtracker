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
      style={{ width: 40, height: 40 }}
    >
      {children}
    </UntouchableButton>
  );
};