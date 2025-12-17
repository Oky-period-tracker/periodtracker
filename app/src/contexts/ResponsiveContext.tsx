import React from 'react'
import { BreakPointSize, UIConfig, breakPoints, responsiveConfig, WidthBreakpointSize } from '../config/UIConfig'
import { useScreenDimensions } from '../hooks/useScreenDimensions'
import { recordToArray } from '../services/utils'
import { getWidthBreakpoint } from '../utils/responsive'

export type ResponsiveContext = {
  width: number
  height: number
  size: BreakPointSize
  widthBreakpoint: WidthBreakpointSize
  UIConfig: UIConfig
}

const defaultValue: ResponsiveContext = {
  width: 0,
  height: 0,
  size: 'm',
  widthBreakpoint: 'md',
  UIConfig: responsiveConfig.s,
}

const ResponsiveContext = React.createContext<ResponsiveContext>(defaultValue)

export const ResponsiveProvider = ({ children }: React.PropsWithChildren) => {
  const { width, height } = useScreenDimensions()
  // Round width to remove decimal places (e.g., 392.727273 -> 392)
  const roundedWidth = Math.floor(width)
  const size = getSize(height)
  const widthBreakpoint = getWidthBreakpoint(roundedWidth)

  const UIConfig = responsiveConfig[size]

  return (
    <ResponsiveContext.Provider
      value={{
        width: roundedWidth,
        height,
        size,
        widthBreakpoint,
        UIConfig,
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  )
}

export const useResponsive = () => {
  return React.useContext(ResponsiveContext)
}

const getSize = (length: number) => {
  let size: BreakPointSize = 's'

  recordToArray(breakPoints).forEach(([key, value]) => {
    if (length >= value) {
      size = key
    }
  })

  return size
}
