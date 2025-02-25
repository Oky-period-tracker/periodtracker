/* eslint-disable @typescript-eslint/no-var-requires */
let miscTranslations = {}

try {
  miscTranslations = require('../resources/translations/misc').miscTranslations
} catch (e) {
  //
}

let genders = [
  { value: 'Male', label: 'Male', iconName: 'male' },
  { value: 'Female', label: 'Female', iconName: 'female' },
  { value: 'Other', label: 'Other', iconName: 'genderless' },
]

try {
  genders = require('../resources/translations/misc').genders
} catch (e) {
  //
}

export { miscTranslations, genders }
