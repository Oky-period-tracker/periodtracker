import { BadgeSize } from '../components/EmojiBadge'

export type BreakPointSize = 's' | 'm' // | 'l' | 'xl'

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
}

export const breakPoints: Record<BreakPointSize, number> = {
  s: 0,
  m: 840,
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
  },
}
