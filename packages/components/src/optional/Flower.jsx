"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowerReducer = exports.incrementFlowerProgress = exports.useFlowerStateSelector = exports.FlowerButton = exports.FlowerModal = exports.FlowerAssetDemo = exports.FlowerProvider = exports.flowerTranslations = exports.flowerAssets = void 0;
// tslint:disable:no-var-requires
const Fragment_1 = require("./Fragment");
let flowerAssets;
try {
    exports.flowerAssets = flowerAssets = require('./Flower/assets').flowerAssets;
}
catch (e) {
    exports.flowerAssets = flowerAssets = {};
}
let flowerTranslations;
try {
    exports.flowerTranslations = flowerTranslations = require('./Flower/translations').flowerTranslations;
}
catch (e) {
    exports.flowerTranslations = flowerTranslations = {};
}
let FlowerProvider;
try {
    exports.FlowerProvider = FlowerProvider = require('./Flower/components/context/FlowerProvider').FlowerProvider;
}
catch (e) {
    exports.FlowerProvider = FlowerProvider = Fragment_1.Fragment;
}
let FlowerAssetDemo;
try {
    exports.FlowerAssetDemo = FlowerAssetDemo = require('./Flower/components/tutorial/FlowerAssetDemo').FlowerAssetDemo;
}
catch (e) {
    exports.FlowerAssetDemo = FlowerAssetDemo = Fragment_1.Fragment;
}
let FlowerModal;
try {
    exports.FlowerModal = FlowerModal = require('./Flower/components/Flower/FlowerModal').FlowerModal;
}
catch (e) {
    exports.FlowerModal = FlowerModal = Fragment_1.Fragment;
}
let FlowerButton;
try {
    exports.FlowerButton = FlowerButton = require('./Flower/components/Flower/FlowerButton').FlowerButton;
}
catch (e) {
    exports.FlowerButton = FlowerButton = Fragment_1.Fragment;
}
let useFlowerStateSelector;
try {
    exports.useFlowerStateSelector = useFlowerStateSelector = require('./Flower/components/context/FlowerProvider')
        .useFlowerStateSelector;
}
catch (e) {
    exports.useFlowerStateSelector = useFlowerStateSelector = () => null;
}
let incrementFlowerProgress = () => ({ type: 'NO_OP' });
exports.incrementFlowerProgress = incrementFlowerProgress;
try {
    exports.incrementFlowerProgress = incrementFlowerProgress = require('./Flower/components/redux/flowerActions')
        .incrementFlowerProgress;
}
catch (e) {
    //
}
let flowerReducer = () => ({ progress: 0, maxProgress: 3 });
exports.flowerReducer = flowerReducer;
try {
    exports.flowerReducer = flowerReducer = require('./Flower/components/redux/flowerReducer').flowerReducer;
}
catch (e) {
    //
}
//# sourceMappingURL=Flower.jsx.map