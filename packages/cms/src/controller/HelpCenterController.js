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
exports.HelpCenterController = void 0;
const typeorm_1 = require("typeorm");
const HelpCenter_1 = require("../entity/HelpCenter");
class HelpCenterController {
    constructor() {
        this.helpCenterRepository = (0, typeorm_1.getRepository)(HelpCenter_1.HelpCenter);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.helpCenterRepository.find({
                where: { lang: request.user.lang },
            });
        });
    }
    mobileHelpCenterByLanguage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.helpCenterRepository.find({
                where: {
                    lang: request.params.lang,
                },
            });
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.helpCenterRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const helpCenterToSave = request.body;
            helpCenterToSave.lang = request.user.lang;
            yield this.helpCenterRepository.save(helpCenterToSave);
            return helpCenterToSave;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const helpCenterToUpdate = yield this.helpCenterRepository.findOne(request.params.id);
            helpCenterToUpdate.title = request.body.title;
            helpCenterToUpdate.caption = request.body.caption;
            helpCenterToUpdate.contactOne = request.body.contactOne;
            helpCenterToUpdate.contactTwo = request.body.contactTwo;
            helpCenterToUpdate.address = request.body.address;
            helpCenterToUpdate.website = request.body.website;
            helpCenterToUpdate.lang = request.user.lang;
            yield this.helpCenterRepository.save(helpCenterToUpdate);
            return helpCenterToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const helpCenterToRemove = yield this.helpCenterRepository.findOne(request.params.id);
            yield this.helpCenterRepository.remove(helpCenterToRemove);
            return helpCenterToRemove;
        });
    }
}
exports.HelpCenterController = HelpCenterController;
//# sourceMappingURL=HelpCenterController.js.map