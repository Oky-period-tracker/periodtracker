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

export { helpCenterData }
