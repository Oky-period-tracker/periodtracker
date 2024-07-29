"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutBannerController = void 0;
const typeorm_1 = require("typeorm");
const AboutBanner_1 = require("../entity/AboutBanner");
class AboutBannerController {
    constructor() {
        this.aboutBannerRepository = (0, typeorm_1.getRepository)(AboutBanner_1.AboutBanner);
    }
    mobileAboutBannerByLanguage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const aboutImage = yield this.aboutBannerRepository.findOne({
                where: { lang: request.params.lang },
            });
            return (aboutImage === null || aboutImage === void 0 ? void 0 : aboutImage.image) ? aboutImage === null || aboutImage === void 0 ? void 0 : aboutImage.image : '';
        });
    }
    mobileAboutBannerByLanguageConditional(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const aboutImage = yield this.aboutBannerRepository.findOne({
                where: { lang: request.params.lang },
            });
            if (!aboutImage) {
                return {
                    shouldUpdate: true,
                    timestamp: new Date().getTime(),
                    aboutBanner: '',
                };
            }
            const query = parseInt((_a = request === null || request === void 0 ? void 0 : request.query) === null || _a === void 0 ? void 0 : _a.timestamp.toString(), 10);
            const timeLastFetched = isNaN(query) ? 0 : query;
            const aboutImageTimestamp = new Date(aboutImage.timestamp).getTime();
            const isAboutImageStale = aboutImageTimestamp > timeLastFetched;
            if (isAboutImageStale) {
                return {
                    shouldUpdate: true,
                    aboutBannerTimestamp: aboutImageTimestamp,
                    aboutBanner: aboutImage.image,
                };
            }
            return {
                shouldUpdate: false,
            };
        });
    }
    saveOrUpdate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let aboutToUpdate = yield this.aboutBannerRepository.findOne({
                where: { lang: request.user.lang },
            });
            if (aboutToUpdate) {
                aboutToUpdate.image = request.body.image;
                aboutToUpdate.timestamp = new Date();
            }
            else {
                aboutToUpdate = request.body;
                aboutToUpdate.lang = request.user.lang;
                aboutToUpdate.timestamp = new Date();
            }
            yield this.aboutBannerRepository.save(aboutToUpdate);
            return aboutToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const aboutToRemove = yield this.aboutBannerRepository.findOne(request.params.id);
            yield this.aboutBannerRepository.remove(aboutToRemove);
            return aboutToRemove;
        });
    }
}
exports.AboutBannerController = AboutBannerController;
//# sourceMappingURL=AboutBannerController.js.map