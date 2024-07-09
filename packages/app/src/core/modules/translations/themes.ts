import { Locale } from ".";
import { Themes } from "../../types/theme";

export type ThemeName =
  | "hills"
  | "mosaic"
  | "village"
  | "desert"
  | "terraces"
  | "beach"
  | "luneta"
  | "mosque";

export type AvatarName =
  | "oky"
  | "julia"
  | "nur"
  | "ari"
  | "pihu"
  | "shiko"
  | "anna"
  | "daisy"
  | "fiona"
  | "manay"
  | "haya"
  | "sitti"
  | "yumi"
  | "mangyan2";

export const baseTheme = {
  periodColor: "#e3629b",
  nonPeriodColor: "#91d9e2",
  fertileColor: "#3ea4dd",
  fontSize: 14,
  lightGreen: "#bae146",
  mediumGreen: "#a2c72d",
  periodNotVerifiedColor: "cyan",
};

export const defaultAvatar: AvatarName = "ari";
export const avatarNames: AvatarName[] = [
  "ari",
  "nur",
  "julia",
  "oky",
  "pihu",
  "shiko",
];

export const defaultTheme: ThemeName = "hills";
export const themeNames: ThemeName[] = ["hills", "village", "mosaic", "desert"];

export const themes: Themes = {
  hills: {
    ...baseTheme,
    id: "hills" as ThemeName,
    primaryBackgroundColor: "#3eb9cd",
  },
  mosaic: {
    ...baseTheme,
    id: "mosaic" as ThemeName,
    primaryBackgroundColor: "#bae146",
  },
  village: {
    ...baseTheme,
    id: "village" as ThemeName,
    primaryBackgroundColor: "#844dd0",
  },
  desert: {
    ...baseTheme,
    id: "desert" as ThemeName,
    primaryBackgroundColor: "#860557",
  },
  terraces: {
    ...baseTheme,
    id: "terraces" as ThemeName,
    primaryBackgroundColor: "#860557", // @TODO
  },
  beach: {
    ...baseTheme,
    id: "beach" as ThemeName,
    primaryBackgroundColor: "#860557", // @TODO
  },
  luneta: {
    ...baseTheme,
    id: "luneta" as ThemeName,
    primaryBackgroundColor: "#860557", // @TODO
  },
  mosque: {
    ...baseTheme,
    id: "mosque" as ThemeName,
    primaryBackgroundColor: "#860557", // @TODO
  },
};

export const themeTranslations: Record<
  Locale,
  Record<AvatarName | ThemeName, string>
> = {
  en: {
    oky: " Oky",
    ari: "ari",
    nur: "nur",
    julia: "anu",
    pihu: "pihu",
    shiko: "shiko",
    anna: "Anna",
    daisy: "Daisy",
    fiona: "Fiona",
    manay: "Man-ay",
    haya: "Haya",
    sitti: "Sitti",
    yumi: "Yumi",
    mangyan2: "Mangyan",
    //
    hills: "hills",
    mosaic: "mosaic",
    village: "village",
    desert: "desert",
    terraces: "rice terraces",
    beach: "dagat",
    luneta: "luneta",
    mosque: "mosque",
  },
  fil: {
    oky: " Oky",
    ari: "ari",
    nur: "nur",
    julia: "anu",
    pihu: "pihu",
    shiko: "shiko",
    anna: "Anna",
    daisy: "Daisy",
    fiona: "Fiona",
    manay: "Man-ay",
    haya: "Haya",
    sitti: "Sitti",
    yumi: "Yumi",
    mangyan2: "Mangyan",
    //
    hills: "hills",
    mosaic: "mosaic",
    village: "village",
    desert: "desert",
    terraces: "rice terraces",
    beach: "dagat",
    luneta: "luneta",
    mosque: "mosque",
  },
};
