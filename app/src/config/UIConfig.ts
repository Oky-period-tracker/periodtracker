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
