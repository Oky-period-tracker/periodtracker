import React from "react";

export type AuthMode =
  | "welcome"
  | "start"
  | "sign_up"
  | "avatar_and_theme"
  | "onboard_journey"
  | "log_in"
  | "re_log_in"
  | "forgot_password"
  | "delete_account";

export type AuthModeContext = {
  authMode: AuthMode;
  setAuthMode: React.Dispatch<React.SetStateAction<AuthMode>>;
};

const defaultValue: AuthModeContext = {
  authMode: "start",
  setAuthMode: () => {
    //
  },
};

const AuthContext = React.createContext<AuthModeContext>(defaultValue);

export const AuthModeProvider = ({ children }) => {
  const initialState = "welcome"; // TODO: based on redux state
  const [authMode, setAuthMode] = React.useState<AuthMode>(initialState);

  return (
    <AuthContext.Provider value={{ authMode, setAuthMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthMode = () => {
  return React.useContext(AuthContext);
};
