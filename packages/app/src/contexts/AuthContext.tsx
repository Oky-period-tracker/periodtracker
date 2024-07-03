import React from "react";
import { FAST_SIGN_UP } from "../config/env";

export type AuthContext = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValue: AuthContext = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
};

const AuthContext = React.createContext<AuthContext>(defaultValue);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(FAST_SIGN_UP);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
