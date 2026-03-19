export const HAIR_OPTIONS = ['00', ...Array.from({ length: 18 }, (_, i) => String(i + 1).padStart(2, '0'))]

export const EYE_OPTIONS = Array.from({ length: 7 }, (_, i) => String(i).padStart(2, '0'))

export const CLOTHING_OPTIONS = [
  'dress1',
  'dress2',
  'dress3',
  'longdressbelt',
  'shortandshirt1',
  'shortandshirt2',
  'shortandshirt3',
  'skirtandshirt',
  'shirtandpants',
  'blazer1',
  'blazer2',
  'jumper',
  'cape',
  'hijab',
  'longuniform',
  'traditional1',
  'traditional2',
  'traditional3',
  'traditional4',
  'traditional5',
]

export const DEVICE_OPTIONS = [
  // Hats subcategory
  'bandana',
  'beanie',
  'beanie2',
  'buckethat',
  'cap',
  'crown',
  'flowers',
  'hat',
  'head',
  'headband',
  'sunhat',
  'headphones',
  // Glasses subcategory
  'darkglasses',
  'glasses',
  'readingglasses2',
  'sunglass1',
  'sunglass2',
  // Accessories subcategory
  'necklace1',
  'necklace2',
  'necklace3',
  // Others subcategory (allows multiple)
  'purse',
  'prostetic2',
  'prostetic1',
  'cane',
  'earings',
]

