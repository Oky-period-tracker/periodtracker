import { BadgeSize } from '../components/EmojiBadge'

export type BreakPointSize = 's' | 'm' | 'l' // | 'xl'

export interface UIConfig {
  carousel: {
    cardWidth: number
    cardMargin: number
  }
  centerCard: {
    width: number
    numberFontSize: number
    textFontSize: number
  }
  tutorial: {
    paddingTop: number
    paddingBottom: number
    emojiCard: {
      titleFontSize: number
      titleMargin: number
      questionFontSize: number
      textFontSize: number
      questionMargin: number
      emojiMargin: number
      badgeSize: BadgeSize
    }
  }
  progressSection: {
    marginVertical: number
    barHeight: number
    iconSize: number
  }
  misc: {
    touchableRowPadding: number
    touchableRowHeight: number
  }
  avatarCustomization: {
    colorsPerRow: number
    colorSwatchSize: number
    colorSwatchGap: number
    bodyTypeSize: {
      width: number
      height: number
    }
    bodyTypeGap: number
    optionImageSize: {
      width: number
      height: number
    }
    optionImageGap: number
    categoryIconSize: number
    categoryGap: number
    avatarPreviewSize: {
      width: number
      height: number
    }
    paddingHorizontal: number
    spacing: {
      small: number
      medium: number
      large: number
    }
  }
  avatarSelection: {
    avatarSize: {
      width: number
      height: number
    }
    avatarMargin: number
    avatarMarginHorizontal: number
    avatarMarginVertical: number
    avatarBorderRadius: number
    borderWidth: number
    iconSize: number
    iconOffsetOutside: number
    iconOffsetInside: number
    borderWidthAdjustment: number
    borderHeightAdjustment: number
    borderLeftOffset: number
    borderTopOffset: number
    paddingTop: number
    paddingBottom: number
    screenPaddingHorizontal: number
    titlePaddingHorizontal: number
    itemsContainerPaddingHorizontal: number
    titleFontSize: number
    titleLineHeight: number
    subtitleFontSize: number
    subtitleLineHeight: number
    reminderFontSize: number
    reminderLineHeight: number
    reminderIconSize: number
    buttonPaddingTop: number
    buttonPaddingBottom: number
    buttonPaddingHorizontal: number
  }
  themeSelection: {
    themeSize: {
      width: number
      height: number
    }
    themeMargin: number
    themeMarginHorizontal: number
    themeMarginVertical: number
    themeBorderRadius: number
    iconSize: number
    iconOffsetOutside: number
    paddingTop: number
    paddingBottom: number
    screenPaddingHorizontal: number
    titlePaddingHorizontal: number
    itemsContainerPaddingHorizontal: number
    titleFontSize: number
    titleLineHeight: number
    subtitleFontSize: number
    subtitleLineHeight: number
    buttonPaddingTop: number
    buttonPaddingBottom: number
    buttonPaddingHorizontal: number
  }
}

export const breakPoints: Record<BreakPointSize, number> = {
  s: 0,
  m: 840,
  l: 900,
}

export const responsiveConfig: Record<BreakPointSize, UIConfig> = {
  s: {
    carousel: {
      cardWidth: 215,
      cardMargin: 32,
    },
    centerCard: {
      width: 100,
      numberFontSize: 26,
      textFontSize: 12,
    },
    tutorial: {
      paddingTop: 12,
      paddingBottom: 12,
      emojiCard: {
        titleFontSize: 16,
        titleMargin: 12,
        textFontSize: 10,
        questionFontSize: 14,
        questionMargin: 8,
        emojiMargin: 4,
        badgeSize: 'tiny',
      },
    },
    progressSection: {
      marginVertical: 0,
      barHeight: 6,
      iconSize: 10,
    },
    misc: {
      touchableRowPadding: 12,
      touchableRowHeight: 80,
    },
    avatarCustomization: {
      colorsPerRow: 5,
      colorSwatchSize: 36,
      colorSwatchGap: 14,
      bodyTypeSize: {
        width: 70,
        height: 105,
      },
      bodyTypeGap: 20,
      optionImageSize: {
        width: 70,
        height: 90,
      },
      optionImageGap: 10,
      categoryIconSize: 44,
      categoryGap: 20,
      avatarPreviewSize: {
        width: 135,
        height: 180,
      },
      paddingHorizontal: 16,
      spacing: {
        small: 8,
        medium: 12,
        large: 20,
      },
    },
    avatarSelection: {
      avatarSize: {
        width: 150,
        height: 96,
      },
      avatarMargin: 4,
      avatarMarginHorizontal: 4,
      avatarMarginVertical: 4,
      avatarBorderRadius: 30, // Less rounded to follow image shape
      borderWidth: 2,
      iconSize: 10,
      iconOffsetOutside: 15,
      iconOffsetInside: 13,
      borderWidthAdjustment: 10,
      borderHeightAdjustment: 1,
      borderLeftOffset: 5,
      borderTopOffset: 0,
      paddingTop: 50,
      paddingBottom: 20,
      screenPaddingHorizontal: 16,
      titlePaddingHorizontal: 12,
      itemsContainerPaddingHorizontal: 2,
      titleFontSize: 20,
      titleLineHeight: 26,
      subtitleFontSize: 14,
      subtitleLineHeight: 20,
      reminderFontSize: 14,
      reminderLineHeight: 20,
      reminderIconSize: 24,
      buttonPaddingTop: 12,
      buttonPaddingBottom: 20,
      buttonPaddingHorizontal: 16,
    },
    themeSelection: {
      themeSize: {
        width: 140,
        height: 90,
      },
      themeMargin: 12,
      themeMarginHorizontal: 12,
      themeMarginVertical: 12,
      themeBorderRadius: 25, // Less rounded to follow image shape
      iconSize: 10,
      iconOffsetOutside: 15,
      paddingTop: 50,
      paddingBottom: 20,
      screenPaddingHorizontal: 16,
      titlePaddingHorizontal: 12,
      itemsContainerPaddingHorizontal: 2,
      titleFontSize: 22,
      titleLineHeight: 28,
      subtitleFontSize: 16,
      subtitleLineHeight: 22,
      buttonPaddingTop: 12,
      buttonPaddingBottom: 20,
      buttonPaddingHorizontal: 16,
    },
  },
  m: {
    carousel: {
      cardWidth: 220,
      cardMargin: 32,
    },
    centerCard: {
      width: 120,
      numberFontSize: 36,
      textFontSize: 14,
    },
    tutorial: {
      paddingTop: 120,
      paddingBottom: 80,
      emojiCard: {
        titleFontSize: 20,
        titleMargin: 24,
        questionFontSize: 16,
        textFontSize: 14,
        questionMargin: 12,
        emojiMargin: 12,
        badgeSize: 'small',
      },
    },
    progressSection: {
      marginVertical: 1,
      barHeight: 8,
      iconSize: 12,
    },
    misc: {
      touchableRowPadding: 24,
      touchableRowHeight: 100,
    },
    avatarCustomization: {
      colorsPerRow: 6,
      colorSwatchSize: 40,
      colorSwatchGap: 16,
      bodyTypeSize: {
        width: 80,
        height: 120,
      },
      bodyTypeGap: 28,
      optionImageSize: {
        width: 80,
        height: 100,
      },
      optionImageGap: 12,
      categoryIconSize: 48,
      categoryGap: 24,
      avatarPreviewSize: {
        width: 155,
        height: 200,
      },
      paddingHorizontal: 16,
      spacing: {
        small: 12,
        medium: 16,
        large: 24,
      },
    },
    avatarSelection: {
      avatarSize: {
        width: 170,
        height: 109,
      },
      avatarMargin: 6,
      avatarMarginHorizontal: 6,
      avatarMarginVertical: 6,
      avatarBorderRadius: 35, // Less rounded to follow image shape
      borderWidth: 2,
      iconSize: 12,
      iconOffsetOutside: 17,
      iconOffsetInside: 15,
      borderWidthAdjustment: 10,
      borderHeightAdjustment: 1,
      borderLeftOffset: 5,
      borderTopOffset: 0,
      paddingTop: 60,
      paddingBottom: 24,
      screenPaddingHorizontal: 16,
      titlePaddingHorizontal: 12,
      itemsContainerPaddingHorizontal: 2,
      titleFontSize: 22,
      titleLineHeight: 28,
      subtitleFontSize: 16,
      subtitleLineHeight: 22,
      reminderFontSize: 14,
      reminderLineHeight: 20,
      reminderIconSize: 20,
      buttonPaddingTop: 16,
      buttonPaddingBottom: 24,
      buttonPaddingHorizontal: 20,
    },
    themeSelection: {
      themeSize: {
        width: 160,
        height: 110,
      },
      themeMargin: 16,
      themeMarginHorizontal: 16,
      themeMarginVertical: 16,
      themeBorderRadius: 30, // Less rounded to follow image shape
      iconSize: 12,
      iconOffsetOutside: 17,
      paddingTop: 60,
      paddingBottom: 24,
      screenPaddingHorizontal: 16,
      titlePaddingHorizontal: 12,
      itemsContainerPaddingHorizontal: 2,
      titleFontSize: 24,
      titleLineHeight: 30,
      subtitleFontSize: 18,
      subtitleLineHeight: 24,
      buttonPaddingTop: 16,
      buttonPaddingBottom: 24,
      buttonPaddingHorizontal: 20,
    },
  },
  l: {
    carousel: {
      cardWidth: 220,
      cardMargin: 32,
    },
    centerCard: {
      width: 120,
      numberFontSize: 36,
      textFontSize: 14,
    },
    tutorial: {
      paddingTop: 120,
      paddingBottom: 80,
      emojiCard: {
        titleFontSize: 20,
        titleMargin: 24,
        questionFontSize: 16,
        textFontSize: 14,
        questionMargin: 12,
        emojiMargin: 12,
        badgeSize: 'small',
      },
    },
    progressSection: {
      marginVertical: 1,
      barHeight: 8,
      iconSize: 12,
    },
    misc: {
      touchableRowPadding: 24,
      touchableRowHeight: 100,
    },
    avatarCustomization: {
      colorsPerRow: 6,
      colorSwatchSize: 40,
      colorSwatchGap: 16,
      bodyTypeSize: {
        width: 80,
        height: 120,
      },
      bodyTypeGap: 28,
      optionImageSize: {
        width: 80,
        height: 100,
      },
      optionImageGap: 12,
      categoryIconSize: 48,
      categoryGap: 24,
      avatarPreviewSize: {
        width: 155,
        height: 200,
      },
      paddingHorizontal: 16,
      spacing: {
        small: 12,
        medium: 16,
        large: 24,
      },
    },
    avatarSelection: {
      avatarSize: {
        width: 150,
        height: 96,
      },
      avatarMargin: 0,
      avatarMarginHorizontal: 0,
      avatarMarginVertical: 6,
      avatarBorderRadius: 48,
      borderWidth: 2,
      iconSize: 12,
      iconOffsetOutside: 17,
      iconOffsetInside: 20,
      borderWidthAdjustment: 10,
      borderHeightAdjustment: 1,
      borderLeftOffset: 5,
      borderTopOffset: 0,
      paddingTop: 60,
      paddingBottom: 24,
      screenPaddingHorizontal: 0,
      titlePaddingHorizontal: 0,
      itemsContainerPaddingHorizontal: 0,
      titleFontSize: 22,
      titleLineHeight: 28,
      subtitleFontSize: 16,
      subtitleLineHeight: 22,
      reminderFontSize: 14,
      reminderLineHeight: 20,
      reminderIconSize: 20,
      buttonPaddingTop: 16,
      buttonPaddingBottom: 24,
      buttonPaddingHorizontal: 20,
    },
    themeSelection: {
      themeSize: {
        width: 140,
        height: 90,
      },
      themeMargin: 4,
      themeMarginHorizontal: 0,
      themeMarginVertical: 16,
      themeBorderRadius: 25, // Less rounded to follow image shape
      iconSize: 12,
      iconOffsetOutside: 32,
      paddingTop: 60,
      paddingBottom: 24,
      screenPaddingHorizontal: 0,
      titlePaddingHorizontal: 0,
      itemsContainerPaddingHorizontal: 0,
      titleFontSize: 24,
      titleLineHeight: 30,
      subtitleFontSize: 18,
      subtitleLineHeight: 24,
      buttonPaddingTop: 16,
      buttonPaddingBottom: 24,
      buttonPaddingHorizontal: 20,
    },
  },
}
