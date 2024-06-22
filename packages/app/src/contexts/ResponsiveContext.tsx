import React from "react";
import {
  BreakPointSize,
  UIConfig,
  breakPoints,
  responsiveConfig,
} from "../config/UIConfig";
import { useScreenDimensions } from "../hooks/useScreenDimensions";
import { recordToArray } from "../services/utils";

export type ResponsiveContext = {
  width: number;
  height: number;
  UIConfig: UIConfig;
};

const defaultValue: ResponsiveContext = {
  width: 0,
  height: 0,
  UIConfig: responsiveConfig.s,
};

const ResponsiveContext = React.createContext<ResponsiveContext>(defaultValue);

export const ResponsiveProvider = ({ children }: React.PropsWithChildren) => {
  const { width, height } = useScreenDimensions();
  const size = getSize(height);

  const UIConfig = responsiveConfig[size];

  return (
    <ResponsiveContext.Provider
      value={{
        width,
        height,
        UIConfig,
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => {
  return React.useContext(ResponsiveContext);
};

const getSize = (width: number) => {
  let size: BreakPointSize = "s";

  recordToArray(breakPoints).forEach(([key, value]) => {
    if (width >= value) {
      size = key;
    }
  });

  return size;
};
