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
  reducer: (state = null) => state,
}
try {
  CustomHelpCenter = {
    Screen: require('./CustomComponents/components/CustomHelpCenter').FindHelpScreen,
    Card: require('./CustomComponents/components/CustomHelpCenter/NeedHelpCard').NeedHelpCard,
    reducer: require('./CustomComponents/components/CustomHelpCenter/redux/helpCenterReducer')
      .helpCenterReducer,
  }
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

export { customComponentsTranslations, CustomSignUp, CustomHelpCenter, CustomProfileScreenWidget }
