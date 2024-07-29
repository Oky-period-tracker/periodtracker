"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsset = void 0;
const assets_1 = require("../assets");
/**
 * Get an asset by path
 * Safe way to access assets, will return null if the asset is not found
 */
const getAsset = (path) => {
    const segments = path.split('.');
    let currentLevel = assets_1.assets;
    for (const segment of segments) {
        currentLevel = currentLevel[segment];
        if (!currentLevel) {
            // tslint:disable-next-line
            console.warn(`Asset not found: ${path}`);
            return null; // or a default asset
        }
    }
    const asset = currentLevel;
    return asset;
};
exports.getAsset = getAsset;
//# sourceMappingURL=asset.js.map