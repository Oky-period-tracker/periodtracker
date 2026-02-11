import { Locale } from '.'
import { CustomAvatarStyles } from '../../optional/styles'

export type ThemeName = 'hills' | 'mosaic' | 'village' | 'desert'

export type AvatarName = 'oky' | 'julia' | 'nur' | 'ari' | 'pihu' | 'shiko' | 'kuku'

export const defaultAvatar: AvatarName = 'ari'
export const avatarNames: AvatarName[] = ['ari', 'nur', 'julia', 'oky', 'pihu', 'shiko', 'kuku']

export const defaultTheme: ThemeName = 'hills'
export const themeNames: ThemeName[] = ['hills', 'village', 'mosaic', 'desert']

export const themeTranslations: Record<Locale, Record<AvatarName | ThemeName, string>> = {
  en: {
    oky: 'oky',
    ari: 'ari',
    nur: 'nur',
    julia: 'anu',
    pihu: 'pihu',
    shiko: 'shiko',
    kuku: 'kuku',
    hills: 'hills',
    mosaic: 'mosaic',
    village: 'village',
    desert: 'desert',
  },
  fr: {
    oky: 'oky',
    ari: 'ari',
    nur: 'nur',
    julia: 'anu',
    pihu: 'pihu',
    shiko: 'shiko',
    kuku: 'kuku',
    hills: 'Collines',
    mosaic: 'Mosaïque',
    village: 'Village',
    desert: 'Désert',
  },
  ru: {
    oky: 'oky',
    ari: 'Аяна',
    nur: 'Экуля',
    julia: 'Бакуля',
    // mia: 'Дайяна',
    pihu: 'pihu',
    shiko: 'shiko',
    kuku: 'kuku',
    hills: 'Холмы',
    mosaic: 'Мозаика',
    village: 'Село',
    desert: 'Город',
    // city: 'Город',
    // lake: 'Озеро',
    // reserve: 'Заповедник',
  },
  pt: {
    oky: 'oky',
    ari: 'ari',
    nur: 'nur',
    julia: 'anu',
    pihu: 'pihu',
    shiko: 'shiko',
    kuku: 'kuku',
    hills: 'Montanhas',
    mosaic: 'Mosaico',
    village: 'Aldeia',
    desert: 'Deserto',
  },
  es: {
    oky: 'oky',
    kuku: 'Kuku',
    //
    ari: 'ari',
    nur: 'nur',
    julia: 'anu',
    pihu: 'pihu',
    shiko: 'shiko',
    hills: 'Montañas',
    mosaic: 'Mosaico',
    village: 'Pueblo',
    desert: 'Desierto',
  },
}

/* 
  Instead of having Icon buttons (eg clouds) the main screen wheel can be a continuous ring,
  Themes included in this list will use this ring style
*/
export const wheelRingThemes: ThemeName[] = ['desert']

/* 
  Optionally adjust the positioning for each avatar
*/
export const getCustomAvatarStyles = ({
  lottieHeight,
}: {
  lottieHeight: number
}): Partial<Record<AvatarName, CustomAvatarStyles>> => ({
  oky: {
    avatar: {
      marginTop: -lottieHeight / 2.25 + 72,
    },
    avatarMessage: {
      top: 0,
    },
    progressSection: {
      bottom: -lottieHeight / 20,
      backgroundColor: 'transparent',
    },
  },
})
