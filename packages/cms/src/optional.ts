// tslint:disable:no-var-requires
let helpCenterData = {
  locations: [],
  attributes: [],
}
try {
  helpCenterData = {
    locations: require('@oky/core/src/modules/translations/helpCenter').helpCenterLocations,
    attributes: require('@oky/core/src/modules/translations/helpCenter').helpCenterAttributes,
  }
} catch (e) {
  //
}

let contentFilterOptions = []

try {
  contentFilterOptions = require('@oky/core/src/modules/translations/restrictions')
    .contentFilterOptions
} catch (e) {
  //
}

let ageRestrictionOptions = []

try {
  ageRestrictionOptions = require('@oky/core/src/modules/translations/restrictions')
    .ageRestrictionOptions
} catch (e) {
  //
}

export { helpCenterData, contentFilterOptions, ageRestrictionOptions }
