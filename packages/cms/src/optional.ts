// tslint:disable:no-var-requires
let helpCenterProvinces = []
try {
  helpCenterProvinces = require('@oky/core/src/modules/translations/cms').helpCenterProvinces
} catch (e) {
  //
}

export { helpCenterProvinces }
