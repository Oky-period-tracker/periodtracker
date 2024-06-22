export type BreakPointSize = "s" | "m" | "l" | "xl";

export type UIConfig = {
  carousel: {
    cardWidth: number;
    cardMargin: number;
  };
  wheel: {
    buttonSize: number;
    buttonFontSize: number;
  };
};

export const breakPoints: Record<BreakPointSize, number> = {
  s: 0,
  m: 600,
  l: 800,
  xl: 1000,
};

export const responsiveConfig: Record<BreakPointSize, UIConfig> = {
  s: {
    carousel: {
      cardWidth: 260,
      cardMargin: 12,
    },
    wheel: {
      buttonSize: 80,
      buttonFontSize: 16,
    },
  },
  m: {
    carousel: {
      cardWidth: 260,
      cardMargin: 12,
    },
    wheel: {
      buttonSize: 80,
      buttonFontSize: 16,
    },
  },
  l: {
    carousel: {
      cardWidth: 240,
      cardMargin: 12,
      // emojiSize: "medium",
      // fontSize: 16,
      // buttonSize: 40,
      // cloudSize: 80,
      // starSize: 24,
    },
    wheel: {
      buttonSize: 80,
      buttonFontSize: 16,
    },
  },
  xl: {
    carousel: {
      cardWidth: 360,
      cardMargin: 12,
      // emojiSize: "large",
      // fontSize: 22,
      // buttonSize: 60,
      // cloudSize: 120,
      // starSize: 48,
    },
    wheel: {
      buttonSize: 160,
      buttonFontSize: 22,
    },
  },
};
