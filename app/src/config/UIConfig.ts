export type BreakPointSize = 's' | 'm' // | 'l' | 'xl'

export interface UIConfig {
  carousel: {
    cardWidth: number
    cardMargin: number
  }
  centerCard: {
    width: number
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
  },
  m: {
    carousel: {
      cardWidth: 220,
      cardMargin: 32,
    },
    centerCard: {
      width: 120,
    },
  },
}
