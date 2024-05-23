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

let CustomProfileScreenWidget = () => null
try {
  CustomProfileScreenWidget = require('./CustomComponents/components/CustomProfileScreenWidget')
    .CustomProfileScreenWidget
} catch (e) {
  //
}

export { customComponentsTranslations, CustomSignUp, CustomProfileScreenWidget }
