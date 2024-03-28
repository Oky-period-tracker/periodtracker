// tslint:disable:no-var-requires
import { Fragment } from './Fragment'

let customComponentsTranslations = {}
try {
  customComponentsTranslations = require('./CustomComponents/translations')
    .customComponentsTranslations
} catch (e) {
  //
}

let CustomSignUp = Fragment
try {
  CustomSignUp = require('./CustomComponents/components/CustomSignUp').CustomSignUp
} catch (e) {
  //
}

let CustomHelpCenter = {
  Screen: undefined,
  Card: undefined,
}
try {
  CustomHelpCenter = {
    Screen: require('./CustomComponents/components/CustomHelpCenter').FindHelpScreen,
    Card: require('./CustomComponents/components/CustomHelpCenter/NeedHelpCard').NeedHelpCard,
  }
} catch (e) {
  //
}

export { customComponentsTranslations, CustomSignUp, CustomHelpCenter }
