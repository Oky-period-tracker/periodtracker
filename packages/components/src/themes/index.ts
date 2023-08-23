import { ThemeName, Themes, AvatarName } from '../types'

import { desert } from './desert'
import { hills } from './hills'
import { mosaic } from './mosaic'
import { village } from './village'

export const themes: Themes = {
  desert,
  hills,
  mosaic,
  village,
}

export const defaultTheme: ThemeName = 'hills'
export const defaultAvatar: AvatarName = 'ari'
