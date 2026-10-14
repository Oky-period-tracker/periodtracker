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

// Deployments can define their own options in @oky/core. Without them, keep a
// single "All" option (level 0 = no filter / no age restriction) so the CMS
// forms never render an empty dropdown and always send a valid level.
const defaultLevelOptions = [
  {
    value: 0,
    description: 'All',
  },
]

const withDefault = (options) =>
  Array.isArray(options) && options.length > 0 ? options : defaultLevelOptions

let contentFilterOptions = defaultLevelOptions

try {
  contentFilterOptions = withDefault(require('@oky/core')?.contentFilterOptions)
} catch (e) {
  //
}

let ageRestrictionOptions = defaultLevelOptions

try {
  ageRestrictionOptions = withDefault(require('@oky/core')?.ageRestrictionOptions)
} catch (e) {
  //
}

export { helpCenterData, contentFilterOptions, ageRestrictionOptions }
