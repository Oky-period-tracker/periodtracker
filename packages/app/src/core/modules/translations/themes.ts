import { Locale } from ".";
import { Appearance } from "../../../components/IconButton";
import Cloud from "../../../components/icons/Cloud";
import { CloudOutline } from "../../../components/icons/CloudOutline";
import { Star } from "../../../components/icons/Star";
import { StarOutline } from "../../../components/icons/StarOutline";
import { SvgIconProps } from "../../../components/icons/types";
import { Themes } from "../../types/theme";
import { CircleOutline } from "../../../components/icons/CircleOutline";
import { Circle } from "../../../components/icons/Circle";

export type ThemeName = "hills" | "mosaic" | "village" | "desert";

export type AvatarName =
  | "oky"
  | "julia"
  | "nur"
  | "ari"
  | "pihu"
  | "shiko"
  | "kuku";

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
  "kuku",
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
};

export const themeTranslations: Record<
  Locale,
  Record<AvatarName | ThemeName, string>
> = {
  en: {
    oky: "oky",
    ari: "ari",
    nur: "nur",
    julia: "anu",
    pihu: "pihu",
    shiko: "shiko",
    kuku: "kuku",
    hills: "hills",
    mosaic: "mosaic",
    village: "village",
    desert: "desert",
  },
  fr: {
    oky: "oky",
    ari: "ari",
    nur: "nur",
    julia: "anu",
    pihu: "pihu",
    shiko: "shiko",
    kuku: "kuku",
    hills: "Collines",
    mosaic: "Mosaïque",
    village: "Village",
    desert: "Désert",
  },
  ru: {
    oky: "oky",
    ari: "Аяна",
    nur: "Экуля",
    julia: "Бакуля",
    // mia: 'Дайяна',
    pihu: "pihu",
    shiko: "shiko",
    kuku: "kuku",
    hills: "Холмы",
    mosaic: "Мозаика",
    village: "Село",
    desert: "Город",
    // city: 'Город',
    // lake: 'Озеро',
    // reserve: 'Заповедник',
  },
  pt: {
    oky: "oky",
    ari: "ari",
    nur: "nur",
    julia: "anu",
    pihu: "pihu",
    shiko: "shiko",
    kuku: "kuku",
    hills: "Montanhas",
    mosaic: "Mosaico",
    village: "Aldeia",
    desert: "Deserto",
  },
  es: {
    oky: "oky",
    kuku: "Kuku",
    //
    ari: "ari",
    nur: "nur",
    julia: "anu",
    pihu: "pihu",
    shiko: "shiko",
    hills: "Montañas",
    mosaic: "Mosaico",
    village: "Pueblo",
    desert: "Desierto",
  },
};

export const IconForTheme: Record<
  ThemeName,
  Record<Appearance, React.FC<SvgIconProps>>
> = {
  hills: {
    fill: Cloud,
    outline: CloudOutline,
  },
  mosaic: {
    fill: Star,
    outline: StarOutline,
  },
  village: {
    fill: Cloud,
    outline: CloudOutline,
  },
  desert: {
    fill: Circle,
    outline: CircleOutline,
  },
};

/* 
  Instead of having Icon buttons (eg clouds) the main screen wheel can be a continuous ring,
  Themes included in this list will use this ring style
*/
export const wheelRingThemes: ThemeName[] = ["desert"];
