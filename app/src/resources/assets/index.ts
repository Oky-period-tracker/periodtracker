import { AppAssets } from '../../core/types'

export const assets: AppAssets = {
  avatars: {
    oky: {
      stationary_colour: require('./images/avatars/icn_avatar_4-colour.png'),
      bubbles: require('./images/avatars/icn_avatar_4-bubbles.png'),
    },
    julia: {
      stationary_colour: require('./images/avatars/icn_avatar_3-colour.png'),
      bubbles: require('./images/avatars/icn_avatar_3-bubbles.png'),
    },
    nur: {
      stationary_colour: require('./images/avatars/icn_avatar_2-colour.png'),
      bubbles: require('./images/avatars/icn_avatar_2-bubbles.png'),
    },
    ari: {
      stationary_colour: require('./images/avatars/icn_avatar_1-colour.png'),
      bubbles: require('./images/avatars/icn_avatar_1-bubbles.png'),
    },
    pihu: {
      stationary_colour: require('./images/avatars/icn_avatar_5-colour.png'),
      bubbles: require('./images/avatars/icn_avatar_5-bubbles.png'),
    },
    shiko: {
      stationary_colour: require('./images/avatars/icn_avatar_6-colour.png'),
      bubbles: require('./images/avatars/icn_avatar_6-bubbles.png'),
    },
    kuku: {
      stationary_colour: require('./images/avatars/icn_avatar_8-colour.png'),
      bubbles: require('./images/avatars/icn_avatar_8-bubbles.png'),
    },
  },
  backgrounds: {
    desert: {
      onPeriod: require('./images/backgrounds/desert-p.jpg'),
      default: require('./images/backgrounds/desert-default.jpg'),
    },
    hills: {
      onPeriod: require('./images/backgrounds/hills-p.jpg'),
      default: require('./images/backgrounds/hills-default.jpg'),
    },
    mosaic: {
      onPeriod: require('./images/backgrounds/mosaic-p.jpg'),
      default: require('./images/backgrounds/mosaic-default.jpg'),
    },
    village: {
      onPeriod: require('./images/backgrounds/village-p.jpg'),
      default: require('./images/backgrounds/village-default.jpg'),
    },
  },
  static: {
    launch_icon: require('./images/static/icn_oky.png'),
    spin_load_face: require('./images/static/icn_oky_spin-1.png'),
    spin_load_circle: require('./images/static/icn_oky_spin-2.png'),
    clouds: require('./images/avatars/cloud.png'),
  },
  icons: {
    locked: require('./icons/locked.png'),
    unlocked: require('./icons/unlocked.png'),
  },
  gifs: {
    friendUnlock: require('./gifs/friend-unlock.gif'),
  },
  general: {
    aboutBanner: {
      en: require('./images/general/about-banner.jpg'),
      es: require('./images/general/about-banner-2.jpg'),
      ru: require('./images/general/about-banner.jpg'),
      pt: require('./images/general/about-banner-2.jpg'),
      fr: require('./images/general/about-banner-2.jpg'),
    },
  },
  lottie: {
    avatars: {
      ari: require('./lottie/ari_lottie.json'),
      julia: require('./lottie/julia_lottie.json'),
      nur: require('./lottie/nur_lottie.json'),
      oky: require('./lottie/oky_lottie.json'),
      pihu: require('./lottie/pihu_lottie.json'),
      shiko: require('./lottie/shiko_lottie.json'),
      kuku: require('./lottie/kuku_lottie.json'),
      friend: require('./lottie/kuku_lottie.json')
    },
  },
  videos: {
    feelingDepressedHappyAndOtherEmotions: require('./videos/FeelingDepressedHappyAndOtherEmotions.mp4'),
    mensesSelfCare: require('./videos/MensesSelfCare.mp4'),
  },
  tutorialSteps: {
    step1: require('./images/tutorial-steps/step1.png'),
    step2: require('./images/tutorial-steps/step2.png'),
    step3: require('./images/tutorial-steps/step3.png'),
    step4: require('./images/tutorial-steps/step4.png'),
    step5: require('./images/tutorial-steps/step5.png'),
  },
}

// Export tutorial steps separately for easier access
export const tutorialSteps = assets.tutorialSteps
