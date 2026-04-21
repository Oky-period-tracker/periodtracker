import { AppAssets } from '../../core/types'

export const assets: AppAssets = {
  avatars: {
    panda: {
      default: require('./images/static/panda.png'),
      stationary_colour: require('./images/static/panda.png'),
      bubbles: require('./images/static/panda.png'),
      theme: require('./images/static/panda.png'),
    },
    unicorn: {
      default: require('./images/static/unicorn.png'),
      stationary_colour: require('./images/static/unicorn.png'),
      bubbles: require('./images/static/unicorn.png'),
      theme: require('./images/static/unicorn.png'),
    },
  },
  backgrounds: {
    desert: {
      onPeriod: require('./images/backgrounds/desert-p.png'),
      default: require('./images/backgrounds/desert-default.png'),
      icon: require('./images/static/themes/icn_theme_4.png'),
    },
    hills: {
      onPeriod: require('./images/backgrounds/hills-p.png'),
      default: require('./images/backgrounds/hills-default.png'),
      icon: require('./images/static/themes/icn_theme_1.png'),
    },
    mosaic: {
      onPeriod: require('./images/backgrounds/mosaic-p.png'),
      default: require('./images/backgrounds/mosaic-default.png'),
      icon: require('./images/static/themes/icn_theme_3.png'),
    },
    village: {
      onPeriod: require('./images/backgrounds/village-p.png'),
      default: require('./images/backgrounds/village-default.png'),
      icon: require('./images/static/themes/icn_theme_2.png'),
    },
  },
  static: {
    launch_icon: require('./images/static/circle.png'),
    spin_load_face: require('./images/static/circle.png'),
    spin_load_circle: require('./images/static/icn_oky_spin-2.png'),
  },
  general: {
    aboutBanner: {
      en: require('./images/general/about-banner.jpg'),
    },
  },
  lottie: {
    avatars: {
      panda: require('./lottie/avatar.json'),
      unicorn: require('./lottie/avatar.json'),
    },
  },
}
