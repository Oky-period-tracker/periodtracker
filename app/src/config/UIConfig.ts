import { BadgeSize } from '../components/EmojiBadge'

export type BreakPointSize = 's' | 'm' // | 'l' | 'xl'

export interface UIConfig {
  carousel: {
    cardWidth: number
    cardMargin: number
  }
  centerCard: {
    width: number
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
  avatar: {
    position: number
  }
  progressSection: {
    position: number
    marginVertical: number
    barHeight: number
    iconSize: number
  }
}

export const breakPoints: Record<BreakPointSize, number> = {
  s: 0,
  m: 740,
}

export const responsiveConfig: Record<BreakPointSize, UIConfig> = {
  s: {
    carousel: {
      cardWidth: 180,
      cardMargin: 24,
    },
    centerCard: {
      width: 100,
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
    avatar: {
      position: -20,
    },
    progressSection: {
      position: 24,
      marginVertical: 0,
      barHeight: 6,
      iconSize: 10,
    },
  },
  m: {
    carousel: {
      cardWidth: 220,
      cardMargin: 32,
    },
    centerCard: {
      width: 120,
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
    avatar: {
      position: -40,
    },
    progressSection: {
      position: 28,
      marginVertical: 1,
      barHeight: 8,
      iconSize: 12,
    },
  },
}
