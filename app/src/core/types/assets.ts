import { ImageSourcePropType } from 'react-native'
import { AnimationObject } from 'lottie-react-native'
import { AvatarName, Locale, ThemeName } from '../../resources/translations'

// Avatar names that have PNG assets (excludes 'friend' which uses SVG components)
type AvatarWithAssets = Exclude<AvatarName, 'friend'>

export interface AppAssets {
  avatars: Record<
    AvatarWithAssets,
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
    clouds: ImageSourcePropType
  }
  icons: {
    locked: ImageSourcePropType
    unlocked: ImageSourcePropType
  }
  gifs: {
    friendUnlock: ImageSourcePropType
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
  tutorial: {
    avatar: {
      step1: ImageSourcePropType
      step2: ImageSourcePropType
      step3: ImageSourcePropType
      step4: ImageSourcePropType
      step5: ImageSourcePropType
    }
  }
  avatar: {
    categories: {
      body: ImageSourcePropType
      hair: ImageSourcePropType
      eyes: ImageSourcePropType
      clothing: ImageSourcePropType
      devices: ImageSourcePropType
    },
    body: Record<string, ImageSourcePropType>
    hair: Record<string, ImageSourcePropType>
    eyes: Record<string, ImageSourcePropType>
    clothing: Record<string, ImageSourcePropType>
    devices: Record<string, ImageSourcePropType>
  },
}
