// import { AppAssets } from '@oky/core'

import { AppAssets } from "../core/types";

export const assets: AppAssets = {
  avatars: {
    panda: {
      default: require("./images/static/panda.png"),
      small: require("./images/static/panda.png"),
      stationary: require("./images/static/panda.png"),
      stationary_colour: require("./images/static/panda.png"),
      bubbles: require("./images/static/panda.png"),
      theme: require("./images/static/panda.png"),
    },
    unicorn: {
      default: require("./images/static/unicorn.png"),
      small: require("./images/static/unicorn.png"),
      stationary: require("./images/static/unicorn.png"),
      stationary_colour: require("./images/static/unicorn.png"),
      bubbles: require("./images/static/unicorn.png"),
      theme: require("./images/static/unicorn.png"),
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
    launch_icon: require("./images/static/circle.png"),
    spin_load_face: require("./images/static/circle.png"),
    spin_load_circle: require("./images/static/icn_oky_spin-2.png"),
    icons: {
      settingsIcon: require("./images/static/icn_settings.png"),
      arrow: require("./images/static/btn-arrow.png"),
      cloudsIcn: require("./images/static/icn_clouds.png"),
      close: require("./images/static/btn-close.png"),
      information: require("./images/static/btn-info-circle.png"),
      infoPink: require("./images/static/btn-info-pink.png"),
      infoBlue: require("./images/static/btn-info-blue.png"),
      closeLine: require("./images/static/btn-close-line.png"),
      edit: require("./images/static/btn-edit.png"),
      down: require("./images/static/btn-down.png"),
      Male: require("./images/static/btn-male.png"),
      MaleGrey: require("./images/static/btn-male-def.png"),
      Female: require("./images/static/btn-female.png"),
      FemaleGrey: require("./images/static/btn-female-def.png"),
      Other: require("./images/static/btn-nogender.png"),
      OtherGrey: require("./images/static/btn-nogender-def.png"),
      Urban: require("./images/static/btn-urban.png"),
      UrbanGrey: require("./images/static/btn-urban-def.png"),
      Rural: require("./images/static/btn-rural.png"),
      RuralGrey: require("./images/static/btn-rural-def.png"),
      Village: require("./images/static/btn-other_area.png"),
      VillageGrey: require("./images/static/btn-other_area-def.png"),
      tick: require("./images/static/btn-tick.png"),
      exclamation: require("./images/static/btn-exclamation.png"),
      news: require("./images/static/btn-news.png"),
      back: require("./images/static/btn-next.png"),
      calendar: require("./images/static/btn-calendar.png"),
      calendarL: require("./images/static/btn-calendar_L.png"),
      genderL: require("./images/static/btn-gender_L.png"),
      locationL: require("./images/static/btn-location_L.png"),
      lockL: require("./images/static/btn-lock_L.png"),
      shieldL: require("./images/static/btn-shield_L.png"),
      profile: require("./images/static/btn-profile.png"),
      profileL: require("./images/static/btn-profile_L.png"),
      profileGuest: require("./images/static/btn-profile_L_guest.png"),
      starLine: require("./images/static/icn-star-line.png"),
      undoOval: require("./images/static/icn_oval_g.png"),
      fullHeart: require("./images/static/icn-heart-full.png"),
      switch: require("./images/static/btn-switch.png"),
      send: require("./images/static/btn-send.png"),
      circleDefaultL: require("./images/static/icn_circle_default_L.png"),
      periodFuture: require("./images/static/icn-period-future.png"),
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
      roundedMask: require("./images/static/mask.png"),
      cycle: require("./images/static/icn-cycle.png"),
      periodLength: require("./images/static/icn-period-length.png"),
      periodDays: require("./images/static/icn-period-days.png"),
      tabs: {
        encyclopedia: require("./images/static/btn-news_L.png"),
        encyclopediaGrey: require("./images/static/btn-news-def.png"),
        main: require("./images/static/btn-calendar_L.png"),
        mainGrey: require("./images/static/btn-calendar-def.png"),
        profile: require("./images/static/btn-profile_L.png"),
        profileGrey: require("./images/static/btn-profile-def.png"),
        settings: require("./images/static/btn-settings_L.png"),
        settingsGrey: require("./images/static/btn-settings-def.png"),
      },
      clouds: {
        nonPeriod: require("./images/static/icn_cloud_np_f.png"),
        fertile: require("./images/static/icn_cloud_f_f.png"),
        period: require("./images/static/icn_cloud_p_f.png"),
        notVerifiedDay: require("./images/static/icn_cloud_nv_f.png"),
      },
      stars: {
        notVerifiedDay: require("./images/static/icn_star_nv_f.png"),
        nonPeriod: require("./images/static/icn_star_np_f.png"),
        fertile: require("./images/static/icn_star_f_f.png"),
        period: require("./images/static/icn_star_p_f.png"),
      },
      circles: {
        notVerifiedDay: require("./images/static/icn_circle_selected_nv_L.png"), // change image
        nonPeriod: require("./images/static/icn_circle_selected_np_M.png"),
        fertile: require("./images/static/icn_circle_selected_f_M.png"),
        period: require("./images/static/icn_circle_selected_p_M.png"),
      },
      segment: {
        notVerifiedDay: require("./images/static/icn_period_unvierified_segment.png"), // change image
        nonPeriod: require("./images/static/icn_no_period_segment.png"),
        fertile: require("./images/static/icn_fertile_segment.png"),
        period: require("./images/static/icn_period_segment.png"),
      },
    },
    dayBadge: {
      notVerifiedDay: require("./images/static/icn_oval_nv_f.png"), // change image
      onPeriod: require("./images/static/icn_oval_p_f.png"),
      onFertile: require("./images/static/icn_oval_f_f.png"),
      default: require("./images/static/icn_oval_np_f.png"),
    },
  },
  general: {
    aboutBanner: {
      en: require("./images/general/about-banner.jpg"),
    },
    calendarStatic: {
      en: require("./images/general/calendar-static.png"),
    },
  },
  lottie: {
    avatars: {
      panda: require("./lottie/avatar.json"),
      unicorn: require("./lottie/avatar.json"),
    },
  },
};
