/* eslint-disable @typescript-eslint/no-var-requires */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let CustomHelpCard = (_: { onPress: () => void }) => {
  return null
}

let customHelpTranslations = {}

let CUSTOM_HELP_CARD_ENABLED = false

try {
  CustomHelpCard = require('../resources/features/customHelpCard/CustomHelpCard').CustomHelpCard

  customHelpTranslations = require('../resources/features/customHelpCard/translations')
    .customHelpTranslations

  CUSTOM_HELP_CARD_ENABLED = true
} catch (e) {
  //
}

export { CustomHelpCard, CUSTOM_HELP_CARD_ENABLED, customHelpTranslations }
