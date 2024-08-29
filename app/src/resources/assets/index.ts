import { AppAssets } from "../../core/types";

export const assets: AppAssets = {
  avatars: {
    oky: {
      default: require("./images/avatars/icn_avatar_4.png"),
      stationary_colour: require("./images/avatars/icn_avatar_4-colour.png"),
      bubbles: require("./images/avatars/icn_avatar_4-bubbles.png"),
      theme: require("./images/avatars/icn_avatar_4_theme.png"),
    },
    julia: {
      default: require("./images/avatars/icn_avatar_3.png"),
      stationary_colour: require("./images/avatars/icn_avatar_3-colour.png"),
      bubbles: require("./images/avatars/icn_avatar_3-bubbles.png"),
      theme: require("./images/avatars/icn_avatar_3_theme.png"),
    },
    nur: {
      default: require("./images/avatars/icn_avatar_2.png"),
      stationary_colour: require("./images/avatars/icn_avatar_2-colour.png"),
      bubbles: require("./images/avatars/icn_avatar_2-bubbles.png"),
      theme: require("./images/avatars/icn_avatar_2_theme.png"),
    },
    ari: {
      default: require("./images/avatars/icn_avatar_1.png"),
      stationary_colour: require("./images/avatars/icn_avatar_1-colour.png"),
      bubbles: require("./images/avatars/icn_avatar_1-bubbles.png"),
      theme: require("./images/avatars/icn_avatar_1_theme.png"),
    },
    pihu: {
      default: require("./images/avatars/icn_avatar_5.png"),
      stationary_colour: require("./images/avatars/icn_avatar_5-colour.png"),
      bubbles: require("./images/avatars/icn_avatar_5-bubbles.png"),
      theme: require("./images/avatars/icn_avatar_5_theme.png"),
    },
    shiko: {
      default: require("./images/avatars/icn_avatar_6.png"),
      stationary_colour: require("./images/avatars/icn_avatar_6-colour.png"),
      bubbles: require("./images/avatars/icn_avatar_6-bubbles.png"),
      theme: require("./images/avatars/icn_avatar_6_theme.png"),
    },
    kuku: {
      default: require("./images/avatars/icn_avatar_8.png"),
      stationary_colour: require("./images/avatars/icn_avatar_8-colour.png"),
      bubbles: require("./images/avatars/icn_avatar_8-bubbles.png"),
      theme: require("./images/avatars/icn_avatar_8_theme.png"),
    },
  },
  backgrounds: {
    desert: {
      onPeriod: require("./images/backgrounds/desert-p.png"),
      default: require("./images/backgrounds/desert-default.png"),
      icon: require("./images/static/themes/icn_theme_4.png"),
    },
    hills: {
      onPeriod: require("./images/backgrounds/hills-p.png"),
      default: require("./images/backgrounds/hills-default.png"),
      icon: require("./images/static/themes/icn_theme_1.png"),
    },
    mosaic: {
      onPeriod: require("./images/backgrounds/mosaic-p.png"),
      default: require("./images/backgrounds/mosaic-default.png"),
      icon: require("./images/static/themes/icn_theme_3.png"),
    },
    village: {
      onPeriod: require("./images/backgrounds/village-p.png"),
      default: require("./images/backgrounds/village-default.png"),
      icon: require("./images/static/themes/icn_theme_2.png"),
    },
  },
  static: {
    launch_icon: require("./images/static/icn_oky.png"),
    spin_load_face: require("./images/static/icn_oky_spin-1.png"),
    spin_load_circle: require("./images/static/icn_oky_spin-2.png"),
    icons: {
      starOrange: {
        empty: require("./images/static/icn-star-line-orange.png"),
        half: require("./images/static/icn-star-half-orange.png"),
        full: require("./images/static/icn-star-full-orange.png"),
      },
      heart: {
        empty: require("./images/static/icn-heart-line.png"),
        half: require("./images/static/icn-heart-half.png"),
        full: require("./images/static/icn-heart-full.png"),
      },
    },
  },
  general: {
    aboutBanner: {
      en: require("./images/general/about-banner.jpg"),
      es: require("./images/general/about-banner-2.jpg"),
      ru: require("./images/general/about-banner.jpg"),
      pt: require("./images/general/about-banner-2.jpg"),
      fr: require("./images/general/about-banner-2.jpg"),
    },
  },
  lottie: {
    avatars: {
      ari: require("./lottie/ari_lottie.json"),
      julia: require("./lottie/julia_lottie.json"),
      nur: require("./lottie/nur_lottie.json"),
      oky: require("./lottie/ari_lottie.json"),
      pihu: require("./lottie/pihu_lottie.json"),
      shiko: require("./lottie/shiko_lottie.json"),
      kuku: require("./lottie/kuku_lottie.json"),
    },
  },
  videos: {
    feelingDepressedHappyAndOtherEmotions: require("./videos/FeelingDepressedHappyAndOtherEmotions.mp4"),
    genderRolesAndStereotypes: require("./videos/GenderRolesAndStereotypes.mp4"),
  },
};
