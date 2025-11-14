// Type declarations for the app

declare module '*.jpg'
declare module '*.png'

// SVG module declaration for react-native-svg-transformer
declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps & { color?: string; fill?: string }>
  export default content
}
