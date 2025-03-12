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
  contentFilterOptions = require('@oky/core')?.contentFilterOptions ?? []
} catch (e) {
  //
}

let ageRestrictionOptions = []

try {
  ageRestrictionOptions = require('@oky/core')?.ageRestrictionOptions ?? []
} catch (e) {
  //
}

export { helpCenterData, contentFilterOptions, ageRestrictionOptions }
