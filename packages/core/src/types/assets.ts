import { ImageSourcePropType } from 'react-native'
import { AnimatedLottieViewProps } from 'lottie-react-native'
import { AvatarName, Locale, ThemeName } from '../modules'

export interface AppAssets {
  avatars: Record<
    AvatarName,
    {
      default: ImageSourcePropType
      small: ImageSourcePropType
      stationary: ImageSourcePropType
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
    icons: {
      play: ImageSourcePropType
      settingsIcon: ImageSourcePropType
      cloudsIcn: ImageSourcePropType
      information: ImageSourcePropType
      down: ImageSourcePropType
      Village: ImageSourcePropType
      VillageGrey: ImageSourcePropType
      exclamation: ImageSourcePropType
      starLine: ImageSourcePropType
      fullHeart: ImageSourcePropType
      circleDefaultL: ImageSourcePropType
      arrow: ImageSourcePropType
      close: ImageSourcePropType
      infoPink: ImageSourcePropType
      infoBlue: ImageSourcePropType
      closeLine: ImageSourcePropType
      edit: ImageSourcePropType
      Male: ImageSourcePropType
      MaleGrey: ImageSourcePropType
      Female: ImageSourcePropType
      FemaleGrey: ImageSourcePropType
      Other: ImageSourcePropType
      OtherGrey: ImageSourcePropType
      Urban: ImageSourcePropType
      UrbanGrey: ImageSourcePropType
      Rural: ImageSourcePropType
      RuralGrey: ImageSourcePropType
      tick: ImageSourcePropType
      news: ImageSourcePropType
      back: ImageSourcePropType
      calendar: ImageSourcePropType
      calendarL: ImageSourcePropType
      genderL: ImageSourcePropType
      locationL: ImageSourcePropType
      lockL: ImageSourcePropType
      shieldL: ImageSourcePropType
      profile: ImageSourcePropType
      profileL: ImageSourcePropType
      profileGuest: ImageSourcePropType
      undoOval: ImageSourcePropType
      switch: ImageSourcePropType
      send: ImageSourcePropType
      periodFuture: ImageSourcePropType
      starOrange: {
        empty: ImageSourcePropType
        half: ImageSourcePropType
        full: ImageSourcePropType
      }
      heart: {
        empty: ImageSourcePropType
        half: ImageSourcePropType
        full: ImageSourcePropType
      }
      roundedMask: ImageSourcePropType
      cycle: ImageSourcePropType
      periodLength: ImageSourcePropType
      periodDays: ImageSourcePropType
      tabs: {
        encyclopedia: ImageSourcePropType
        encyclopediaGrey: ImageSourcePropType
        main: ImageSourcePropType
        mainGrey: ImageSourcePropType
        profile: ImageSourcePropType
        profileGrey: ImageSourcePropType
        settings: ImageSourcePropType
        settingsGrey: ImageSourcePropType
      }
      clouds: {
        nonPeriod: ImageSourcePropType
        fertile: ImageSourcePropType
        period: ImageSourcePropType
        notVerifiedDay: ImageSourcePropType
      }
      stars: {
        notVerifiedDay: ImageSourcePropType
        nonPeriod: ImageSourcePropType
        fertile: ImageSourcePropType
        period: ImageSourcePropType
      }
      circles: {
        notVerifiedDay: ImageSourcePropType
        nonPeriod: ImageSourcePropType
        fertile: ImageSourcePropType
        period: ImageSourcePropType
      }
      segment: {
        notVerifiedDay: ImageSourcePropType
        nonPeriod: ImageSourcePropType
        fertile: ImageSourcePropType
        period: ImageSourcePropType
      }
    }
    dayBadge: {
      notVerifiedDay: ImageSourcePropType
      onPeriod: ImageSourcePropType
      onFertile: ImageSourcePropType
      default: ImageSourcePropType
    }
  }
  general: {
    aboutBanner: Record<Locale, ImageSourcePropType>
    calendarStatic: Record<Locale, ImageSourcePropType>
  }
  lottie: {
    avatars: Record<AvatarName, AnimatedLottieViewProps['source']>
  }
  videos?: Record<string, any> // TODO: VideoSourcePropType ?
}
