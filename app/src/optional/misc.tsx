/* eslint-disable @typescript-eslint/no-var-requires */
let miscTranslations = {}

try {
  miscTranslations = require('../resources/translations/misc').miscTranslations
} catch (e) {
  //
}

export { miscTranslations }
