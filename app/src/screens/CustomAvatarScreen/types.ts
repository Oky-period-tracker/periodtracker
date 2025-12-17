export interface AvatarSelection {
  bodyType: 'body-small' | 'body-medium' | 'body-large'
  skinColor?: string | undefined
  hairStyle: string | null
  hairColor?: string | undefined
  eyeShape: string | null
  eyeColor?: string | undefined
  smile?: string | undefined
  clothing: string | null
  devices: string[]
  name: string
}

export type Category = 'body' | 'hair' | 'eyes' | 'clothing' | 'devices'

