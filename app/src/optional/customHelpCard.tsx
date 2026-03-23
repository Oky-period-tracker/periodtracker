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

  // Force disabled - set to true to re-enable custom help card
  CUSTOM_HELP_CARD_ENABLED = false
} catch (e) {
  //
}

export { CustomHelpCard, CUSTOM_HELP_CARD_ENABLED, customHelpTranslations }
