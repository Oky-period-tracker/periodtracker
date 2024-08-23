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

let contentFilterOptions = [
  {
    value: 0,
    description: 'All',
  },
]

try {
  contentFilterOptions = require('@oky/core/src/modules/translations/cms').contentFilterOptions
} catch (e) {
  //
}

let ageRestrictionOptions = [
  {
    value: 0,
    description: 'All',
  },
]

try {
  ageRestrictionOptions = require('@oky/core/src/modules/translations/cms').ageRestrictionOptions
} catch (e) {
  //
}

export { helpCenterData, contentFilterOptions, ageRestrictionOptions }
