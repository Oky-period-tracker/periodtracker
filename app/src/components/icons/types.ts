import { StyleProp, ViewStyle } from 'react-native'
import { PaletteStatus } from '../../config/theme'

export interface SvgIconProps {
  style?: StyleProp<ViewStyle>
  size?: number
  status?: PaletteStatus
}
