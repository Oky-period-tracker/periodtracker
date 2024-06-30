export type PaletteStatus =
  | "primary"
  | "secondary"
  | "tertiary"
  | "neutral"
  | "basic"
  | "danger"
  | "danger_light";

export const palette: Record<
  PaletteStatus,
  {
    base: string;
    highlight: string;
    shadow: string;
    dark: string;
    text: string;
  }
> = {
  primary: {
    base: "#97C800",
    highlight: "#fff",
    shadow: "#00A65A",
    dark: "#028045",
    text: "#97C800",
  },
  secondary: {
    base: "#FF8C00",
    highlight: "#FFC26A",
    shadow: "#BD6600",
    dark: "#944f00",
    text: "#FF8C00",
  },
  tertiary: {
    base: "#3DA4DD",
    highlight: "#fff",
    shadow: "#1169BF",
    dark: "#0344A5",
    text: "#3DA4DD",
  },
  neutral: {
    base: "#91d9e2",
    highlight: "#fff",
    shadow: "#53b8c8",
    dark: "#2f9cb1",
    text: "#91d9e2",
  },
  basic: {
    base: "#D1D0D2",
    highlight: "#fff",
    shadow: "#B7B6B6",
    dark: "#82807f",
    text: "#000",
  },
  danger: {
    base: "#E3629B",
    highlight: "#F9C7C1",
    shadow: "#971B63",
    dark: "#6b1244",
    text: "#E3629B",
  },
  danger_light: {
    base: "#F9C7C1",
    highlight: "#FFF",
    shadow: "#E3629B",
    dark: "#971B63",
    text: "#F9C7C1",
  },
};
