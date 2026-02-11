import { Appearance } from '../../components/IconButton'
import { Circle } from '../../components/icons/Circle'
import { CircleOutline } from '../../components/icons/CircleOutline'
import Cloud from '../../components/icons/Cloud'
import { CloudOutline } from '../../components/icons/CloudOutline'
import { Star } from '../../components/icons/Star'
import { StarOutline } from '../../components/icons/StarOutline'
import { SvgIconProps } from '../../components/icons/types'
import { ThemeName } from './themes'

export const IconForTheme: Record<ThemeName, Record<Appearance, React.FC<SvgIconProps>>> = {
  hills: {
    fill: Cloud,
    outline: CloudOutline,
  },
  mosaic: {
    fill: Star,
    outline: StarOutline,
  },
  village: {
    fill: Cloud,
    outline: CloudOutline,
  },
  desert: {
    fill: Circle,
    outline: CircleOutline,
  },
}
