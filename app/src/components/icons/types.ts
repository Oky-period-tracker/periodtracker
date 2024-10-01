import { StyleProp, ViewStyle } from 'react-native'
import { PaletteStatus } from '../../hooks/useColor'

export interface SvgIconProps {
  style?: StyleProp<ViewStyle>
  size?: number
  status?: PaletteStatus
}
