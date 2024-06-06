import React from "react";

export type AuthMode =
  | "start"
  | "sign_up"
  | "log_in"
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
  const [authMode, setAuthMode] = React.useState<AuthMode>("start");

  return (
    <AuthContext.Provider value={{ authMode, setAuthMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthMode = () => {
  return React.useContext(AuthContext);
};
