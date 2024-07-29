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
exports.TermsAndConditionsController = void 0;
const typeorm_1 = require("typeorm");
const TermsAndConditions_1 = require("../entity/TermsAndConditions");
class TermsAndConditionsController {
    constructor() {
        this.termsAndConditionsRepository = (0, typeorm_1.getRepository)(TermsAndConditions_1.TermsAndConditions);
    }
    mobileTermsAndConditionsByLanguage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const allTermsAndConditionVersions = yield this.termsAndConditionsRepository.find({
                where: { lang: request.params.lang },
            });
            const latest = allTermsAndConditionVersions[allTermsAndConditionVersions.length - 1];
            return (latest === null || latest === void 0 ? void 0 : latest.json_dump) || [];
        });
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.termsAndConditionsRepository.find({
                where: { lang: request.user.lang },
            });
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.termsAndConditionsRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const aboutToSave = request.body;
            aboutToSave.lang = request.user.lang;
            yield this.termsAndConditionsRepository.save(aboutToSave);
            return aboutToSave;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const aboutToUpdate = yield this.termsAndConditionsRepository.findOne(request.params.id);
            aboutToUpdate.json_dump = request.body.json_dump;
            aboutToUpdate.lang = request.user.lang;
            yield this.termsAndConditionsRepository.save(aboutToUpdate);
            return aboutToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const aboutToRemove = yield this.termsAndConditionsRepository.findOne(request.params.id);
            yield this.termsAndConditionsRepository.remove(aboutToRemove);
            return aboutToRemove;
        });
    }
}
exports.TermsAndConditionsController = TermsAndConditionsController;
//# sourceMappingURL=TermsAndConditionsController.js.map