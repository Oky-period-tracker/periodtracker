// tslint:disable:no-var-requires
import { Fragment } from './Fragment'

let flowerAssets
try {
  flowerAssets = require('./flower/assets').flowerAssets
} catch (e) {
  flowerAssets = {}
}

let flowerTranslations
try {
  flowerTranslations = require('./flower/translations').flowerTranslations
} catch (e) {
  flowerTranslations = {}
}

let FlowerProvider
try {
  FlowerProvider = require('./flower/components/context/FlowerProvider').FlowerProvider
} catch (e) {
  FlowerProvider = Fragment
}

let FlowerAssetDemo
try {
  FlowerAssetDemo = require('./flower/components/tutorial/FlowerAssetDemo').FlowerAssetDemo
} catch (e) {
  FlowerAssetDemo = Fragment
}

let FlowerModal
try {
  FlowerModal = require('./flower/components/Flower/FlowerModal').FlowerModal
} catch (e) {
  FlowerModal = Fragment
}

let FlowerButton
try {
  FlowerButton = require('./flower/components/Flower/FlowerButton').FlowerButton
} catch (e) {
  FlowerButton = Fragment
}

let useFlowerStateSelector
try {
  useFlowerStateSelector = require('./flower/components/context/FlowerProvider')
    .useFlowerStateSelector
} catch (e) {
  useFlowerStateSelector = () => null
}

let incrementFlowerProgress = () => ({ type: 'NO_OP' })
try {
  incrementFlowerProgress = require('./flower/components/redux/flowerActions')
    .incrementFlowerProgress
} catch (e) {
  //
}

let flowerReducer = () => ({ progress: 0, maxProgress: 3 })
try {
  flowerReducer = require('./flower/components/redux/flowerReducer').flowerReducer
} catch (e) {
  //
}

export {
  flowerAssets,
  flowerTranslations,
  FlowerProvider,
  FlowerAssetDemo,
  FlowerModal,
  FlowerButton,
  useFlowerStateSelector,
  incrementFlowerProgress,
  flowerReducer,
}
