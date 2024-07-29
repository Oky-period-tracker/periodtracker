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
exports.DidYouKnowController = void 0;
const typeorm_1 = require("typeorm");
const DidYouKnow_1 = require("../entity/DidYouKnow");
const uuid_1 = require("uuid");
class DidYouKnowController {
    constructor() {
        this.didYouKnowRepository = (0, typeorm_1.getRepository)(DidYouKnow_1.DidYouKnow);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.didYouKnowRepository.find({ where: { lang: request.user.lang } });
        });
    }
    mobileDidYouKnowByLanguage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.didYouKnowRepository.find({
                where: { lang: request.params.lang, live: true },
                order: { title: 'ASC' },
            });
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.didYouKnowRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const didYouKnowToSave = request.body;
            didYouKnowToSave.id = (0, uuid_1.v4)();
            didYouKnowToSave.lang = request.user.lang;
            yield this.didYouKnowRepository.save(didYouKnowToSave);
            return didYouKnowToSave;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const booleanFromStringLive = request.body.live === 'true';
            const booleanFromStringAge = request.body.isAgeRestricted === 'true';
            const didYouKnowToUpdate = yield this.didYouKnowRepository.findOne(request.params.id);
            didYouKnowToUpdate.title = request.body.title;
            didYouKnowToUpdate.content = request.body.content;
            didYouKnowToUpdate.lang = request.user.lang;
            didYouKnowToUpdate.isAgeRestricted = booleanFromStringAge;
            didYouKnowToUpdate.live = booleanFromStringLive;
            yield this.didYouKnowRepository.save(didYouKnowToUpdate);
            return didYouKnowToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const didYouKnowToRemove = yield this.didYouKnowRepository.findOne(request.params.id);
            yield this.didYouKnowRepository.remove(didYouKnowToRemove);
            return didYouKnowToRemove;
        });
    }
}
exports.DidYouKnowController = DidYouKnowController;
//# sourceMappingURL=DidYouKnowController.js.map