import { ImageSourcePropType } from 'react-native'
import { AnimationObject } from 'lottie-react-native'
import { AvatarName, Locale, ThemeName } from '../../resources/translations'

export interface AppAssets {
  avatars: Record<
    AvatarName,
    {
      default: ImageSourcePropType
      stationary_colour: ImageSourcePropType
      bubbles: ImageSourcePropType
      theme: ImageSourcePropType
    }
  >
  backgrounds: Record<
    ThemeName,
    {
      onPeriod: ImageSourcePropType
      default: ImageSourcePropType
      icon: ImageSourcePropType
    }
  >
  static: {
    launch_icon: ImageSourcePropType
    spin_load_face: ImageSourcePropType
    spin_load_circle: ImageSourcePropType
  }
  general: {
    aboutBanner: Record<Locale, ImageSourcePropType>
  }
  lottie: {
    avatars: Record<AvatarName, AnimationObject>
  }
  // TODO:
  // eslint-disable-next-line
  videos?: Record<string, any> // TODO: VideoSourcePropType ?
}
