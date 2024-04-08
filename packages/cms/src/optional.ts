// tslint:disable:no-var-requires
let helpCenterLocations = []
try {
  helpCenterLocations = require('@oky/core/src/modules/translations/cms').helpCenterLocations
} catch (e) {
  //
}

export { helpCenterLocations }
