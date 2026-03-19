// Color options
export const SKIN_COLORS = [
  '#F2E0E5',
  '#FFCC85',
  '#EAD2C1',
  '#C67D3C',
  '#603A17',
  '#F1B98C',
  '#936154',
  '#EEC4A0',
  '#B67E60',
  '#F1EAE4',
  '#DCA87B',
  '#D3977B',
]

export const HAIR_COLORS = [
  '#111111',
  '#6E411C',
  '#CC2B14',
  '#FFD578',
  '#67B221',
  '#D338B9',
  '#D16C0A',
  '#8966EC',
  '#853821',
  '#ED7600',
  '#498CFA',
]

export const EYE_COLORS = [
  '#111111',
  '#945A1C',
  '#A88044',
  '#909249',
  '#6F979E',
  '#ABADB3',
]

// Color name mapping for accessibility labels
export const SKIN_COLOR_NAMES: Record<string, string> = {
  '#F2E0E5': 'customizer_skin_color_light_pink',
  '#FFCC85': 'customizer_skin_color_peach',
  '#EAD2C1': 'customizer_skin_color_beige',
  '#C67D3C': 'customizer_skin_color_tan',
  '#603A17': 'customizer_skin_color_dark_brown',
  '#F1B98C': 'customizer_skin_color_light_tan',
  '#936154': 'customizer_skin_color_medium_brown',
  '#EEC4A0': 'customizer_skin_color_cream',
  '#B67E60': 'customizer_skin_color_bronze',
  '#F1EAE4': 'customizer_skin_color_ivory',
  '#DCA87B': 'customizer_skin_color_sand',
  '#D3977B': 'customizer_skin_color_caramel',
}

export const HAIR_COLOR_NAMES: Record<string, string> = {
  '#111111': 'customizer_hair_color_black',
  '#6E411C': 'customizer_hair_color_brown',
  '#CC2B14': 'customizer_hair_color_red',
  '#FFD578': 'customizer_hair_color_blonde',
  '#67B221': 'customizer_hair_color_green',
  '#D338B9': 'customizer_hair_color_pink',
  '#D16C0A': 'customizer_hair_color_orange',
  '#8966EC': 'customizer_hair_color_purple',
  '#853821': 'customizer_hair_color_dark_brown',
  '#ED7600': 'customizer_hair_color_bright_orange',
  '#498CFA': 'customizer_hair_color_blue',
}

export const EYE_COLOR_NAMES: Record<string, string> = {
  '#111111': 'customizer_eye_color_black',
  '#945A1C': 'customizer_eye_color_brown',
  '#A88044': 'customizer_eye_color_hazel',
  '#909249': 'customizer_eye_color_green',
  '#6F979E': 'customizer_eye_color_blue',
  '#ABADB3': 'customizer_eye_color_gray',
}

export const COLORS_PER_PAGE = 6

// Device subcategories - hidden logic
export const DEVICE_SUBCATEGORIES = {
  hats: ['bandana', 'beanie', 'beanie2', 'buckethat', 'cap', 'crown', 'flowers', 'hat', 'head', 'headband', 'sunhat', 'headphones'],
  glasses: ['darkglasses', 'glasses', 'readingglasses2', 'sunglass1', 'sunglass2'],
  accessories: ['necklace1', 'necklace2', 'necklace3'],
  others: ['purse', 'prostetic2', 'prostetic1', 'cane', 'earings'],
} as const

// Helper to get subcategory for a device
export const getDeviceSubcategory = (device: string): keyof typeof DEVICE_SUBCATEGORIES | null => {
  for (const [category, items] of Object.entries(DEVICE_SUBCATEGORIES)) {
    if ((items as readonly string[]).includes(device)) {
      return category as keyof typeof DEVICE_SUBCATEGORIES
    }
  }
  return null
}

// Helper to check if device allows multiple selection
export const allowsMultipleDevices = (device: string): boolean => {
  return (DEVICE_SUBCATEGORIES.others as readonly string[]).includes(device)
}

