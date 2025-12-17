import { BadgeSize } from '../components/EmojiBadge'

export type BreakPointSize = 's' | 'm' | 'l' // | 'xl'

// Width-based breakpoints for responsive layouts
export type WidthBreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const widthBreakpoints: Record<WidthBreakpointSize, number> = {
  xs: 0,      // < 360dp (very small phones)
  sm: 360,    // 360-480dp (small phones)
  md: 480,    // 480-840dp (large phones/small tablets)
  lg: 840,    // 840-1200dp (tablets)
  xl: 1200,   // > 1200dp (large tablets)
}

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
    contentContainerWidthPercent: number
    avatarsContainerWidthPercent: number
    titleFontSize: number
    titleLineHeight: number
    subtitleFontSize: number
    subtitleLineHeight: number
    reminderFontSize: number
    reminderLineHeight: number
    reminderIconSize: number
    reminderLeftMargin: number
    reminderRightMargin: number
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
      // Original small-screen setup, with tighter gaps between color circles
      colorsPerRow: 5,
      colorSwatchSize: 40,
      colorSwatchGap: 10,
      bodyTypeSize: {
        width: 78,
        height: 117,
      },
      bodyTypeGap: 22,
      optionImageSize: {
        width: 78,
        height: 100,
      },
      optionImageGap: 12,
      categoryIconSize: 48,
      categoryGap: 22,
      avatarPreviewSize: {
        width: 150,
        height: 200,
      },
      paddingHorizontal: 18,
      spacing: {
        small: 10,
        medium: 14,
        large: 22,
      },
    },
    avatarSelection: {
      avatarSize: {
        width: 130, // Further reduced to ensure 3 avatars fit per row on 480dp
        height: 55, // Reduced proportionally
      },
      avatarMargin: 4,
      avatarMarginHorizontal: 2, // Further reduced for better fit on 480dp screens
      avatarMarginVertical: 8,
      avatarBorderRadius: 40, // More rounded
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
      contentContainerWidthPercent: 92, // Increased from 90% for better use of space on 480dp
      avatarsContainerWidthPercent: 96, // Reduced from 98% for better proportions
      titleFontSize: 20,
      titleLineHeight: 26,
      subtitleFontSize: 14,
      subtitleLineHeight: 20,
      reminderFontSize: 14,
      reminderLineHeight: 20,
      reminderIconSize: 24,
      reminderLeftMargin: 74, // titlePaddingHorizontal (12) + logo width (50) + logo margin (12)
      reminderRightMargin: 16, // Match screenPaddingHorizontal for consistency
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
      themeBorderRadius: 55, // More rounded to fit well around image
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
      // Keep 6 swatches on medium screens with original size but tighter gaps
      colorsPerRow: 6,
      colorSwatchSize: 40,
      colorSwatchGap: 8,
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
        width: 182, // Decreased from 187
        height: 80, // Decreased from 86
      },
      avatarMargin: 6,
      avatarMarginHorizontal: 6,
      avatarMarginVertical: 6,
      avatarBorderRadius: 45, // More rounded
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
      contentContainerWidthPercent: 92, // 92% width for medium screens
      avatarsContainerWidthPercent: 99, // 99% width for avatars container (larger)
      titleFontSize: 22,
      titleLineHeight: 28,
      subtitleFontSize: 16,
      subtitleLineHeight: 22,
      reminderFontSize: 16,
      reminderLineHeight: 22,
      reminderIconSize: 20,
      reminderLeftMargin: 74, // titlePaddingHorizontal (12) + logo width (50) + logo margin (12)
      reminderRightMargin: 16, // Match screenPaddingHorizontal for consistency
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
      themeBorderRadius: 60, // More rounded to fit well around image
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
      // Keep 6 swatches on large screens with original size but tighter gaps
      colorsPerRow: 6,
      colorSwatchSize: 40,
      colorSwatchGap: 8,
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
        width: 160, // Decreased from 165
        height: 68, // Decreased from 74
      },
      avatarMargin: 4,
      avatarMarginHorizontal: 4,
      avatarMarginVertical: 6,
      avatarBorderRadius: 50, // More rounded
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
      contentContainerWidthPercent: 94, // 94% width for large screens
      avatarsContainerWidthPercent: 99, // 99% width for avatars container (larger)
      titleFontSize: 22,
      titleLineHeight: 28,
      subtitleFontSize: 16,
      subtitleLineHeight: 22,
      reminderFontSize: 16,
      reminderLineHeight: 22,
      reminderIconSize: 20,
      reminderLeftMargin: 74, // titlePaddingHorizontal (0) + logo width (50) + logo margin (12) = 62, but using 74 for consistency
      reminderRightMargin: 0, // Match screenPaddingHorizontal for consistency
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
      themeBorderRadius: 55, // More rounded to fit well around image
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
