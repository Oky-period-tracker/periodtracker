import { Locale } from '.'
import { Themes } from '../../types/theme'

export type ThemeName = 'hills' | 'mosaic' | 'village' | 'desert'

export type AvatarName = 'panda' | 'unicorn'

export const baseTheme = {
  periodColor: '#e3629b',
  nonPeriodColor: '#91d9e2',
  fertileColor: '#3ea4dd',
  fontSize: 14,
  lightGreen: '#bae146',
  mediumGreen: '#a2c72d',
  periodNotVerifiedColor: 'cyan',
}

export const defaultAvatar: AvatarName = 'panda'
export const avatarNames: AvatarName[] = ['panda', 'unicorn']

export const defaultTheme: ThemeName = 'hills'
export const themeNames: ThemeName[] = ['hills', 'village', 'mosaic', 'desert']

export const themes: Themes = {
  hills: {
    ...baseTheme,
    id: 'hills' as ThemeName,
    primaryBackgroundColor: '#3eb9cd',
  },
  mosaic: {
    ...baseTheme,
    id: 'mosaic' as ThemeName,
    primaryBackgroundColor: '#bae146',
  },
  village: {
    ...baseTheme,
    id: 'village' as ThemeName,
    primaryBackgroundColor: '#844dd0',
  },
  desert: {
    ...baseTheme,
    id: 'desert' as ThemeName,
    primaryBackgroundColor: '#860557',
  },
}

export const themeTranslations: Record<Locale, Record<AvatarName | ThemeName, string>> = {
  en: {
    panda: 'panda',
    unicorn: 'unicorn',
    hills: 'hills',
    mosaic: 'mosaic',
    village: 'village',
    desert: 'desert',
  },
}
